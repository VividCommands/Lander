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
- Desktop cards were inspected after the follow-up correction with dark neutral surfaces, white titles, blue/warm edge accents, readable 14px feature copy, transparent screenshot areas, simplified Lifetime pricing and Pro renewal copy. Header descriptions are removed. The original planet styling is restored, and hero app windows display larger.
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

Checkout destinations were verified from website markup only. No Payhip account actions or purchases were performed for these corrections. No physical-device test, purchase/download test, Lighthouse score, or field Web Vitals measurement is claimed.
