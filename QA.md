# Product update checks

Scope: Macro Standard/Pro presentation and direct checkout links, updated home imagery, Optii screenshot clipping, and PingR palette/asset cleanup. Website license checking and the renewal/upgrade popup were removed at the owner's request.

## Static checks

- JavaScript syntax checks passed for script.js and macro-refresh.js.
- Git whitespace checks passed.
- Local image, stylesheet, and script paths resolve for macro.html, index.html, pc.html, ping.html, packages.html, and faq.html. These pages have no duplicate IDs.
- Macro has exactly the two approved direct Payhip checkout destinations and no dialog, form, or key input. Its gallery script contains no license-verification request.

## Browser evidence

- Macro next: cycled through all five screenshots; each image loaded, exactly one frame stayed visible, and its caption, edition, and position matched.
- Macro previous: Enter on the previous button moved from screenshot 1 to screenshot 5.
- Macro pause/play: each action changed the visible label and accessible name; manual navigation remained available while paused.
- Choose your edition: navigated to the real #plans section.
- Home product selectors: Macro.io, Optii, and PingR each came forward with the matching current-selector label. Previous moved PingR to Optii; next returned to PingR.
- Home inactive products have inert and aria-hidden attributes, preventing keyboard focus on their invisible links.
- Home pause: changed Pause to Play with the matching accessible name.
- Optii See how it works: navigated to the existing section. The expanded screenshot was inspected with the black exterior clipped to the four original windows; its controls and text remain the original pixels.
- Product pages were checked inside 375px-wide browser iframes. Each had a 360px client width after the native scrollbar and a matching scroll width, with no horizontal overflow. Macro's phone image uses the 440px Pro screenshot and renders at 320px; gallery hit areas are 44 by 44px, and purchase buttons are 46px high.
- Product sections no longer receive reveal-hidden, avoiding content that waits for an intersection animation before appearing.
- The inspected application consoles showed no application error; the browser extension reported unrelated metadata errors.

## Checkout checks

The existing xKhTB checkout was observed showing Macro.io Standard Lifetime at $15.00. The existing NZ9tG checkout was observed showing Macro.io Pro at $24.99. Both lead directly to checkout. Displayed tax varies by buyer location. Pro was changed from Invisible to Unlisted so its direct link can be used by visitors. Download files were not replaced, and no purchase was submitted.

No physical-device test, real purchase/download test, Lighthouse score, or field Web Vitals measurement is claimed.
