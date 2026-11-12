# Website correction checks

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
- Desktop cards were inspected with distinct navy and warm copper/charcoal surfaces, contrasting badges and separate feature headings. Lifetime checkmarks and the internal separator lines are removed; Pro keeps its gold plus markers. Card screenshots are larger and the surrounding spacing is tighter. The original planet and hero remain unchanged in this refinement.
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
- The Products Macro image is now 183 by 133px at the inspected desktop width, about 12% larger than the previous 163 by 119px size. Its computed background remains transparent, with no filter. The price text is exactly $15. Its stylesheet follows packages-fixes.css.
- No JavaScript, original image files, home carousel behavior, or dependencies changed in this correction. Macro's inspected console contains no application errors.

## Pro copy, pricing and hover refinement

- Pro has seven separate labels and no feature descriptions: Advanced timings, Dynamic Edit mode, Advanced Auto Build, Advanced Hotkeys, Instant Reset, Macro Lab and Macro IQ.
- The footer explicitly presents $24.99 One time, $9.99 Per month to renew Pro and Lifetime access + 30 days of Pro. The initial price and renewal price now stack vertically, with centered access details and action beneath them. No First month label or duplicated inclusion note remains.
- Pointer testing confirmed each card changes its border and shadow and reaches a transform of translateY(-3px). Leaving the cards restores transform none and the original border/shadow. Pro has its own warmer, stronger hover treatment.
- At 320px, 375px and 768px iframe widths, both purchase buttons fit inside their cards and remain at least 44px high. Document scroll widths match client widths. After centering, both Pro prices have matching client/scroll widths without the former narrow-column font override.
- The hero and automatic image catalogs are unchanged. Larger card images retain their original proportions and transparent surrounding areas.

## Centered card content

- Both cards' computed text alignment is center. Badge, name, feature headings, feature text, access copy and purchase actions follow the same axis. Each Pro plus and label center as a single row.
- In all three responsive checks, purchase buttons had zero horizontal offset from the card center, and price centers differed by less than 0.01px. Pro's second price appears below the first rather than alongside it.
- Desktop rendering was inspected after the layout change. The initial price uses 40px type; the centered monthly renewal amount uses 28px type. Both retain their existing explanatory labels.
- No feature wording, values, image sizing, hover treatment, other pages, JavaScript or checkout destinations changed in this alignment refinement. The inspected Macro console showed no application errors.

Checkout destinations were verified from website markup only. No Payhip account actions or purchases were performed for these corrections. No physical-device test, purchase/download test, Lighthouse score, or field Web Vitals measurement is claimed.

## Home destination, PingR clarity and faster galleries

- View Products and the downward indicator share the featured-products anchor. At the 1348 by 926 desktop viewport, the showcase starts at about 80px, the four-card grid begins at 542px and ends at 912px. Macro.io is the active product at arrival. The full row is visible beneath the showcase after the navigation settles.
- After leaving Home at its hero, Macro.io remains first while the showcase is offscreen. Selecting PingR and then activating View Products with Enter returns Macro.io to the front. Existing product selection and automatic rotation still operate.
- Home at 320px, 375px and 768px iframe widths has matching client/scroll widths of 305px, 360px and 753px. The anchor starts at about 80px, the product grid at about 590px, and Macro's full image, text and action fit above the carousel controls.
- PingR loads the existing 1419 by 1108 transparent PNG at the same 720px desktop display width. The restored text and controls are visibly clearer than the former WebP. A small corner clip removes the exterior bottom-left specks. At 375px the image loads within its container and the document has matching 360px client/scroll widths.
- Macro intervals are 3200ms for the hero and 4200ms for both purchase cards. Browser observation confirmed that all three advance automatically to different loaded screenshots. Their image catalogs and hold-to-pause behavior are unchanged.
- JavaScript syntax and Git whitespace checks pass. This update changes no purchase values, direct checkout destinations, Payhip settings or original image bytes.
