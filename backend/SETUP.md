# Macro.io renewal endpoint

Add this blueprint to the existing PythonAnywhere Flask app without replacing its other routes:

```python
from renewal import renewal
app.register_blueprint(renewal)
```

Install the requirements in that app's virtual environment. Configure these values in the server's private environment before importing the app, then reload the web app:

- `MACRO_STANDARD_PRODUCT_SECRET`: current Standard product secret for xKhTB.
- `MACRO_PRO_PRODUCT_SECRET`: current Pro product secret for NZ9tG.
- `MACRO_RENEW_PRODUCT_SECRET`: Renew product secret for i627S.
- `MACRO_RENEWAL_CUTOVER_UTC`: actual Standard/Pro website launch instant, including UTC offset. All earlier Standard/Pro purchases are excluded. Do not copy the desktop app's older October 27 cutoff unless it is independently confirmed as the website launch boundary.
- `MACRO_RENEWAL_RATE_DB`: absolute writable path outside the public website, e.g. `/home/Gowway/mysite/private/renewal_rate.sqlite3`.

No secrets belong in the public GitHub repository. The endpoint verifies via Payhip's read-only API and never consumes an activation. A disabled/refunded key, Lite key, mismatched product, or missing/ambiguous purchase timestamp fails verification. Enabled expired Pro and Renew keys remain eligible for purchasing another term.

The website posts to `https://gowway.pythonanywhere.com/api/macro/renewal/verify`. Both lonware.com origins are allowed. Configure the WSGI server's trusted proxy handling before the blueprint if needed; the code deliberately ignores untrusted X-Forwarded-For headers. Check that requests from different clients have distinct trusted `REMOTE_ADDR` values.

Before release, test one real eligible key and one real legacy key, verify checkout prices and download delivery for all three products, and set the launch instant. Unit tests use synthetic keys and mocked Payhip responses.

This hides the Renew link until verification in the website UI. Payhip's public checkout URL can still be shared after a buyer sees it. Enforcing eligibility at the payment itself requires Payhip-side support or a server-created checkout; this endpoint cannot make a public Payhip product unpurchasable by URL.
