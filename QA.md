# November 12 website correction checks

Scope: Macro presentation, complete screenshot galleries, home Macro imagery, and Products image sizing. Payhip account changes and website license verification are excluded.

## Static verification

- JavaScript syntax checks passed for script.js, macro-refresh.js, and macro-slides.js. Git whitespace checks passed.
- The gallery catalog has exactly 5 unique Lifetime images, 15 unique Pro images, and 20 unique combined images. Every referenced file exists.
- All 19 original screenshots were copied byte for byte from the supplied ZIP. The twentieth image is the existing newer IQ composite. Source pixels were not regenerated or resized in the files.
- Local resource references resolve for the edited HTML pages. Macro has only the existing xKhTB and NZ9tG direct checkout links, with no key input, dialog, or verification request.
- Macro visible copy contains no Standard label, For Windows eyebrow, Choose your edition control, or dash punctuation. Home contains no edition badge or Play/Pause control.

## Browser verification

- Desktop Macro hero and both cards advanced automatically to different loaded images without any Play action. Cards use slower intervals than the hero.
- Holding the Lifetime image for 8 seconds kept the same source throughout, exceeding its 6.8 second interval. After release the source advanced again despite the image retaining keyboard focus.
- Desktop cards were inspected after the current correction with deep navy surfaces, contrasting badges, Included features and Only in Pro headings, blue checks and gold additions. The compact purchase actions have different emphasis and share a footer with their prices. Header descriptions remain removed. The original planet remains unchanged. Hero app windows are reduced from the previous update with more space above the cards.
- Home's existing product selector brought Macro forward; its screenshot rotated automatically. No extra edition label or pause button is present.
- The Products page was inspected with its different Macro controller screenshot and contained sizing beside the other product images.
- Macro was inspected at 320px, 375px, and 768px iframe widths. Document client widths were respectively 305px, 360px, and 753px after native scrollbars, with matching scroll widths and no horizontal overflow. The narrow layout stacks the cards.
- Home and Products were checked at 375px iframe width: both had matching 360px client/scroll widths and loaded Macro images.
- Inspected Macro and home console logs contained no application errors.

## Homepage follow-up

- Each featured product now stays forward for 15 seconds. The active Optii/PingR screenshot changes every 5 seconds; its timer starts when the product comes forward. The next image is decoded before being shown.
- In browser timing checks, both Optii and PingR changed from image 0 to image 1 while the same product remained active.
- Desktop Optii image bounds fit inside the media region with their original aspect ratios. Centered intrinsic image dimensions replace conflicting full-height and half-offset rules, so the expanded screenshot's window mask no longer clips a letterboxed image.
- At 375px homepage width, all five Macro/Optii/PingR image elements fit within their media width and height. Macro's rotating image is constrained to the actual mobile media height.
- Rechecked Macro at 320px/768px and Home/Products at 375px. All four document scroll widths match their client widths. Card gallery computed backgrounds are transparent with 0px borders. The Products Macro media has transparent background, no background image and 0px padding.

## Current purchase-card correction

- Rechecked Macro at 320px, 375px and 768px iframe widths. Client/scroll widths match at 305px, 360px and 753px respectively. Both purchase buttons remain within their cards at all three sizes, with 44px minimum height. The footer wraps on narrow cards.
- Keyboard Tab moves from the Lifetime gallery to Buy Lifetime, then the Pro gallery and Buy Pro. Both links show a 2px visible focus outline. Their original checkout destinations remain xKhTB and NZ9tG; no checkout was opened.
- Lifetime and Pro badge, feature and button foreground/background pairs were checked against the lightest relevant card colors. All sampled pairs exceed 9:1 contrast. Decorative markers are not the only way to distinguish features; headings and readable names provide the same meaning.
- The Products Macro image is now 163 by 119px at the inspected desktop width, with transparent computed background and no filter. Its visible size is comparable to the neighboring application screenshots. Its stylesheet follows packages-fixes.css, eliminating the earlier conflicting size rule.
- No JavaScript, original image files, home carousel behavior, or dependencies changed in this correction. Macro's inspected console contains no application errors.

Checkout destinations were verified from website markup only. No Payhip account actions or purchases were performed for these corrections. No physical-device test, purchase/download test, Lighthouse score, or field Web Vitals measurement is claimed.
