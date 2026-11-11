import os
import tempfile
import unittest
from datetime import datetime, timezone
from unittest.mock import patch
from flask import Flask
from renewal import renewal, eligible, instant

KEY = 'ABCDE-12345-FGHIJ-67890'
CUTOFF = '2026-11-11T12:00:00+00:00'


def record(product='xKhTB', date=CUTOFF, **changes):
    return dict(enabled=True, product_link=product, license_key=KEY, date=date, **changes)


class RenewalTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        app = Flask(__name__)
        app.register_blueprint(renewal)
        app.config.update(TESTING=True, MACRO_RENEWAL_RATE_DB=self.temp.name+'/rate.db')
        self.client = app.test_client()
        self.env = patch.dict(os.environ, {
            'MACRO_STANDARD_PRODUCT_SECRET':'prod_sk_xKhTB_TEST',
            'MACRO_PRO_PRODUCT_SECRET':'prod_sk_NZ9tG_TEST',
            'MACRO_RENEW_PRODUCT_SECRET':'prod_sk_i627S_TEST',
            'MACRO_RENEWAL_CUTOVER_UTC':CUTOFF,
        })
        self.env.start()
        self.addCleanup(self.env.stop)
        self.addCleanup(self.temp.cleanup)

    def post(self, key=KEY, origin='https://lonware.com'):
        return self.client.post('/api/macro/renewal/verify', json={'license_key':key}, headers={'Origin':origin})

    def test_new_standard_and_pro_accepted(self):
        for product in ('xKhTB','NZ9tG'):
            with self.subTest(product=product), patch('renewal.verify_at_payhip', side_effect=lambda p,s,k: record(product) if p==product else None):
                r=self.post();self.assertEqual(r.status_code,200)
                self.assertEqual(r.json,dict(eligible=True,checkout_url='https://payhip.com/buy?link=i627S'))
                self.assertNotIn(KEY,r.text)
                self.assertIn('no-store',r.headers['Cache-Control'])

    def test_legacy_standard_and_pro_rejected(self):
        for product in ('xKhTB','NZ9tG'):
            with self.subTest(product=product), patch('renewal.verify_at_payhip', side_effect=lambda p,s,k: record(product,'2026-11-11T11:59:59+00:00') if p==product else None):
                self.assertEqual(self.post().json['error'],'ineligible')

    def test_renew_key_has_no_legacy_product(self):
        with patch('renewal.verify_at_payhip',side_effect=lambda p,s,k:record('i627S','2026-11-01T00:00:00+00:00') if p=='i627S' else None):
            self.assertEqual(self.post().status_code,200)

    def test_bad_records_rejected(self):
        cutoff=instant(CUTOFF)
        bad=[None,{},dict(record(),enabled=False),dict(record(),enabled=1),dict(record(),product_link='uIdob'),dict(record(),license_key='OTHER'),dict(record(),date=''),dict(record(),date='2026-11-11T12:00:00'),dict(record(),date='2099-01-01T00:00:00Z')]
        for data in bad:
            with self.subTest(data=data):self.assertFalse(eligible(data,'xKhTB',KEY,cutoff))

    def test_unknown_and_lite_rejected(self):
        with patch('renewal.verify_at_payhip',return_value=None) as api:
            self.assertEqual(self.post().json['error'],'ineligible')
            self.assertEqual([c.args[0] for c in api.call_args_list],['xKhTB','NZ9tG','i627S'])

    def test_upstream_failure_is_not_invalid_key(self):
        with patch('renewal.verify_at_payhip',side_effect=RuntimeError('unavailable')):
            r=self.post();self.assertEqual(r.status_code,503);self.assertNotIn('checkout_url',r.json)

    def test_bad_and_missing_config_fails_closed(self):
        for value in ('','not-a-date','2026-11-11T12:00:00'):
            with patch.dict(os.environ,{'MACRO_RENEWAL_CUTOVER_UTC':value}):self.assertEqual(self.post().status_code,503)

    def test_cors_and_preflight(self):
        self.assertEqual(self.post(origin='https://evil.example').status_code,403)
        r=self.client.options('/api/macro/renewal/verify',headers={'Origin':'https://www.lonware.com'})
        self.assertEqual(r.status_code,204)
        self.assertEqual(r.headers['Access-Control-Allow-Origin'],'https://www.lonware.com')
        self.assertNotIn('Access-Control-Allow-Origin',self.post(origin='https://evil.example').headers)

    def test_input_validation(self):
        for key in ('','<script>','A'*101,None,12):
            self.assertEqual(self.post(key=key).status_code,400)
        self.assertEqual(self.client.post('/api/macro/renewal/verify',data='x',headers={'Origin':'https://lonware.com'}).status_code,400)

    def test_rate_limit(self):
        with patch('renewal.verify_at_payhip',return_value=None):
            for _ in range(8):self.assertEqual(self.post().status_code,403)
            r=self.post();self.assertEqual(r.status_code,429);self.assertEqual(r.headers['Retry-After'],'60')

    def test_no_activation_consumed(self):
        from renewal import verify_at_payhip
        from unittest.mock import MagicMock
        response=MagicMock();response.__enter__.return_value.read.return_value=b'{"data":null}'
        with patch('renewal.urlopen',return_value=response) as call:
            verify_at_payhip('xKhTB','test-secret',KEY)
            req=call.call_args.args[0]
            self.assertEqual(req.get_method(),'GET')
            self.assertIn('/api/v2/license/verify?',req.full_url)
            self.assertNotIn('/usage',req.full_url)

if __name__=='__main__':unittest.main()
