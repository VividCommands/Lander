"""Read-only Payhip verification for Lonware's renewal checkout."""
import hashlib
import hmac
import json
import os
import re
import sqlite3
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from flask import Blueprint, current_app, jsonify, request

renewal = Blueprint('macro_renewal', __name__)
ORIGINS = frozenset(('https://lonware.com', 'https://www.lonware.com'))
PRODUCTS = (
    ('xKhTB', 'MACRO_STANDARD_PRODUCT_SECRET'),
    ('NZ9tG', 'MACRO_PRO_PRODUCT_SECRET'),
    ('i627S', 'MACRO_RENEW_PRODUCT_SECRET'),
)


def instant(value):
    if not isinstance(value, str) or not value.strip():
        raise ValueError('Missing timestamp')
    result = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if result.tzinfo is None:
        raise ValueError('Ambiguous timestamp')
    return result.astimezone(timezone.utc)


def eligible(data, product, key, cutoff):
    if not isinstance(data, dict) or data.get('enabled') is not True:
        return False
    if data.get('product_link') != product or not isinstance(data.get('license_key'), str):
        return False
    if not hmac.compare_digest(data['license_key'], key):
        return False
    try:
        issued = instant(data.get('date'))
        # Renew has its own product and no legacy plans. Standard and Pro reuse
        # product IDs, so only purchases on/after the website launch qualify.
        return issued <= datetime.now(timezone.utc) and (product == 'i627S' or issued >= cutoff)
    except (ValueError, TypeError, OverflowError):
        return False


def verify_at_payhip(product, secret, key):
    url = 'https://payhip.com/api/v2/license/verify?' + urlencode({'license_key': key})
    req = Request(url, headers={'product-secret-key': secret, 'Accept': 'application/json', 'User-Agent': 'Lonware-Renewal/1.0'})
    try:
        with urlopen(req, timeout=6) as response:
            raw = response.read(32769)
            if len(raw) > 32768:
                raise RuntimeError('Provider response too large')
            if not raw.strip():
                return None
            body = json.loads(raw)
            if not isinstance(body, dict):
                raise RuntimeError('Unexpected provider response')
            return body.get('data')
    except HTTPError as exc:
        # Invalid credentials, provider failures and rate limits must fail closed.
        if exc.code in (400, 404, 422):
            return None
        raise RuntimeError('Provider unavailable') from None
    except (URLError, TimeoutError, OSError, ValueError):
        raise RuntimeError('Provider unavailable') from None


def rate_limited():
    db_path = current_app.config.get('MACRO_RENEWAL_RATE_DB') or os.environ.get('MACRO_RENEWAL_RATE_DB')
    if not db_path:
        raise RuntimeError('Missing rate limit store')
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    # REMOTE_ADDR is the WSGI peer. Do not trust client-supplied forwarding headers.
    identity = hashlib.sha256((request.remote_addr or 'unknown').encode()).hexdigest()
    bucket = int(time.time() // 60)
    with sqlite3.connect(db_path, timeout=5) as db:
        db.execute('CREATE TABLE IF NOT EXISTS renewal_rate (identity TEXT, bucket INTEGER, hits INTEGER, PRIMARY KEY(identity,bucket))')
        db.execute('BEGIN IMMEDIATE')
        db.execute('DELETE FROM renewal_rate WHERE bucket < ?', (bucket - 2,))
        db.execute('INSERT INTO renewal_rate VALUES(?,?,1) ON CONFLICT(identity,bucket) DO UPDATE SET hits=hits+1', (identity, bucket))
        hits = db.execute('SELECT hits FROM renewal_rate WHERE identity=? AND bucket=?', (identity, bucket)).fetchone()[0]
        return hits > 8


@renewal.after_request
def protect_response(response):
    if request.headers.get('Origin') in ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
        response.headers['Vary'] = 'Origin'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Max-Age'] = '600'
    response.headers['Cache-Control'] = 'no-store, private'
    response.headers['Pragma'] = 'no-cache'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'no-referrer'
    return response


@renewal.route('/api/macro/renewal/verify', methods=['POST', 'OPTIONS'])
def check_key():
    if request.headers.get('Origin') not in ORIGINS:
        return jsonify(eligible=False, error='forbidden'), 403
    if request.method == 'OPTIONS':
        return '', 204
    if not request.is_json or request.content_length is None or request.content_length > 2048:
        return jsonify(eligible=False, error='invalid_request'), 400
    body = request.get_json(silent=True)
    key = body.get('license_key') if isinstance(body, dict) else None
    if not isinstance(key, str):
        return jsonify(eligible=False, error='invalid_request'), 400
    key = key.strip().upper()
    if not re.fullmatch(r'[A-Z0-9-]{5,100}', key):
        return jsonify(eligible=False, error='invalid_request'), 400
    try:
        if rate_limited():
            response = jsonify(eligible=False, error='rate_limited')
            response.headers['Retry-After'] = '60'
            return response, 429
        cutoff = instant(os.environ['MACRO_RENEWAL_CUTOVER_UTC'])
        secrets = [(product, os.environ[name]) for product, name in PRODUCTS]
        if any(not value.startswith('prod_sk_' + product + '_') for product, value in secrets):
            raise ValueError('Invalid product configuration')
    except (KeyError, ValueError, OSError, sqlite3.Error, RuntimeError):
        return jsonify(eligible=False, error='unavailable'), 503
    failed = False
    for product, secret in secrets:
        try:
            data = verify_at_payhip(product, secret, key)
        except RuntimeError:
            failed = True
            continue
        if eligible(data, product, key, cutoff):
            return jsonify(eligible=True, checkout_url='https://payhip.com/buy?link=i627S')
    return jsonify(eligible=False, error='unavailable' if failed else 'ineligible'), 503 if failed else 403
