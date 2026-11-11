# Optional Cloudflare renewal endpoint

Prepared alternative to the installed PythonAnywhere endpoint, whose free-account outbound proxy rejects Payhip with `Tunnel connection failed: 403 Forbidden`.

This Worker exposes only `/api/macro/renewal/verify`. It uses the same read-only Payhip verification, product/date eligibility and direct $9.99 checkout as the Flask implementation. It requires a D1 database bound as `DB`, initialized using `schema.sql`.

Store `MACRO_STANDARD_PRODUCT_SECRET`, `MACRO_PRO_PRODUCT_SECRET` and `MACRO_RENEW_PRODUCT_SECRET` as Worker secrets. Set `MACRO_RENEWAL_CUTOVER_UTC` to the actual launch instant with timezone. Deploy `index.mjs` as the Worker module, then update `macro-refresh.js` to its verified production origin. No account IDs, production secrets or invented deployment URLs are included here.

Cloudflare documents a Workers Free plan and D1 free allowances. Use the free plan only; deployment still needs access to the owner's Cloudflare account. This alternative is prepared and unit-tested, not deployed or tested against real customer keys.

Official references:
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/workers/configuration/secrets/
