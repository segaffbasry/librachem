/* One easing family for the whole site, measured on acnetwork.nl.
   ACN's Webflow interactions (webflow.*.js IX2 data) all run on CSS "ease" = cubic-bezier(.25,.1,.25,1), at
   200, 300, 500 and 700ms; its buttons use the same curve at 0.2s (styles: `.new-button { transition: box-shadow .2s,
   transform .2s, opacity .3s }`). The CSS twins live in app/globals.css as --ease and --dur-*. */

// ACN "ease" (IX2 easing:"ease"; also the CSS default the .new-button transition falls back to).
export const EASE = "0.25,0.1,0.25,1";

export const timing = {
  label: 0.5, // ACN IX2 500ms
  heading: 0.7, // ACN IX2 700ms (its longest)
  text: 0.7,
  lineStagger: 0.07,
  card: 0.5,
  image: 0.9,
  late: 0.75, // multiplier for sections marked data-late
};
