# Verification and release status

## Content and visual gate

The feature list was checked against the latest v2.44C / Standard v2.33A source, the Standard vs Lifetime Pro comparison file, and the three linked update threads. The complete latest thread and relevant earlier turns were readable; older shared threads virtualize their messages, so the source and comparison file are the authority for the feature list. No claim of controller Elevator 90s or new-buyer Lifetime Pro was added. Checkout product IDs remain xKhTB and NZ9tG; Renew is i627S.

## Purpose and identity gate

Design decisions and their purpose are recorded in DESIGN.md. The Anti-Slop core rulebook at https://github.com/miqdadbadjuber/anti-slop was consulted during implementation. Product screenshots, existing typefaces, navy surfaces, and a single warm Pro outline preserve the owner's direction. No generated asset was required.

## Functional evidence

11 endpoint unit tests passed, including Standard/Pro launch boundaries, repeat Renew eligibility, disabled/malformed/future-dated licenses, mismatched/Lite products, origin restrictions, rate limiting, missing configuration, provider outage behavior, and read-only API usage. These use synthetic records and mocked Payhip responses, not real purchase verification.

JavaScript syntax checks passed for the updated scripts. Browser inspection confirmed Macro layout, previous/next image changes, pause/play, edition captions, modal opening, native required-field validation, Escape closing with focus restoration, and PingR's refreshed canvas and image. Home carousel pause/play was also verified. Browser extension metadata errors were present, with no application error observed in the inspected console. Mobile breakpoint rules were inspected, but device viewport emulation was unavailable in this browser. Lighthouse/Web Vitals were not measured.

## Release gate: blocked

The changes are staged for review, not production-ready yet. The existing PythonAnywhere account requires sign-in. The endpoint must be installed and privately configured, the actual website launch cutoff must be set, and live eligible/legacy key tests must pass. Browser checkout verification found xKhTB still priced at $14.99 and NZ9tG still titled Lifetime Macro and priced at $64.99. i627S is Macro.io Pro Renew at $9.99 before tax. Standard and Pro need price/product updates before release. No purchases were made, so download delivery remains unverified.

The $9.99 public Payhip checkout can be shared after verification. This UI gate does not enforce purchase eligibility inside Payhip checkout.
