# Libra Speciality Chemicals: homepage redesign (private prospect demo)

A one-page rebuild of [librachem.co.uk](https://librachem.co.uk/) in Libra's own skin: its traced logo, its fonts
(Lato, with Montserrat as display), its real copy, film and photography. Layout and pacing follow
[acnetwork.nl](https://www.acnetwork.nl/) (Amsterdam Chemistry Network), which is both the look and the motion reference.

```bash
npm install
npm run dev        # http://127.0.0.1:3034
npm run typecheck
npm run build      # static: / plus the framework's /_not-found (and /icon.svg)
```

| Script | What it does |
| --- | --- |
| `npm run scrape` | `scripts/scrape.mjs`: reads the live homepage and its four featured posts into `content/home.json` |
| `npm run media` | `scripts/media.sh`: downloads every image and film into `_scrape/raw` (gitignored) and writes the toned web versions to `public/media` and `public/badges` |
| `npm run logo` | `scripts/logo.py`: traces the logo PNG into vector parts, writes `lib/logo.ts` and `public/logos/*.svg` (needs `brew install potrace`) |

## Route

One route, `/` (`app/page.tsx` → `components/home/Home.tsx`). No archive or detail pages. Every card, "all news",
menu and footer link carries the real live URL (canonical address from `page-sitemap.xml` / `post-sitemap.xml`) and
opens in a new tab with `rel="noopener"`. As a standing rule for these demos, a capture-phase guard in
`components/motion.tsx` cancels clicks on any link not starting with `#`, so the demo never navigates away.
In-page links (`#about`, `#markets`, …) scroll through Lenis.

## Recon (Phase 1)

**Live homepage** (WordPress 7.1 + Flatsome theme, All in One SEO), top to bottom:

| Live section | Items | This build |
| --- | --- | --- |
| Hero: brand film + two H1s ("The UK's Leading" / "Manufacturer & Global Distributor…") | 1 film, 2 lines | Hero: both lines, the film (`libra-film.mp4`) |
| Animated logo GIF + intro paragraph + "over 50 years… Learn more about:" | 1 + 2 | About: statement + paragraph |
| Three boxes: Libra Products / Applications & Distribution / Contract & Toll | 3 | 3 pillar cards (photos replace the GIF icons) |
| Image tiles: About us, Our Products, Personal care, HI & I Cleaning, Contract manufacturing, Agriculture, Oil & gas, Industrial sectors | 8 | Markets grid: 8 |
| "Made in Manchester (UK) / Distributed around the world" film tile | 1 | Manchester band with its film |
| Our Accreditations: 2 paragraphs, badges, "View resources" | 2 + 12 + 1 | 2 + 12 + 1 |
| Events & Awards slider | 1 post | 1 event row |
| Linko page tile (brand values image) | 1 | Footer "Follow" link (image dropped: it is a decorative card) |
| Latest News | 3 posts | 3 cards |
| LinkedIn News (Elfsight widget) | widget | Cut: third-party feed; LinkedIn is linked in the footer |
| Footer: useful links (4), address, email, phone, hours, LinkedIn, QR card | | All except the QR-code card link (a qrcodechimp page duplicating the contact details) |

Every item the live homepage shows is here except the two noted cuts. Nothing was cut for pacing: the live page is
already short.

**Brand.** No vector logo exists (only two 498×246 PNGs). `scripts/logo.py` upscales the light-ground PNG 6×, splits
it into the two inks by colour, flood-fills each connected shape and traces it alone with potrace, so the logo
arrives as parts: the letters `L I B R A`, the lime `wave` across the A, the two `orbit` swooshes and the `tagline`.
The favicon (`app/icon.svg`) is the A with its wave on navy. Fonts: the live site sets everything in **Lato**
(400/700), which is self-hosted here for UI and body. The wordmark is a geometric sans with flat terminals; its closest
open-licence match is **Montserrat**, used as display (preloader, hero, headings).

**Palette** (confirmed): Navy `#263068` (logo letters, live text colour), Lime `#a9ca49` (logo swooshes, live
"GET IN TOUCH!" pill), Mist `#f1f1f1` (live grey ground), White. No other hues: lines, muted text and focus rings are
these colours at lower alpha. Lime never sets text on white (1.9:1); it is a fill, or text on navy (6.6:1).

**Site structure.** Header: five dropdowns (About us 3, Products 13, Applications 6, Contract & Toll 5,
News & Resources 4) plus "Get in touch!". Footer: "Useful Links and Resources" (Privacy Policy, Cookies, News Room &
Resources, Get in touch), address, contact, office hours, registered company line. Socials: LinkedIn only.
All in `lib/site.ts`.

**Reference (acnetwork.nl, Webflow).** White surface, deep ink `#101f2d`, one blue field (`#4475ce`), mint accent,
General Sans set in capitals at a regular weight (h1 35.6px/1.4, statement 27.7px, card titles 23.8px, body 17.8px,
nav and buttons 15.8px at 1440px), hairline `#d0e0e0` grids, `--padding--section: 6.25em` (99px). Interactions
(from the Webflow IX2 data in its JS): almost all hover-driven, every one on CSS `ease` at 200/300/500/700ms; the
header hides on scroll down and returns on scroll up. No smooth scroll, no scroll-driven recolouring, so this build
has no blended backdrop: sections have their own grounds.

## Page plan and length

| # | Section | Ground | Imagery |
| --- | --- | --- | --- |
| 1 | Hero: statement left, brand film panel right (ACN's hero + blue panel) | white | Libra site film |
| 2 | About: statement, paragraph, three stepped cards (ACN's offset cards) | white | reactor panel, site aerial, control room |
| 3 | Markets: 8 tiles on a ruled grid (ACN's member wall) | mist | 8 tile photos |
| 4 | Made in Manchester band (ACN's dark CTA) | navy | Manchester film |
| 5 | Accreditations: 12 marks on a ruled grid | white | badges |
| 6 | Events & Awards row + Latest News cards (ACN's event row and news cards) | mist | award, 3 post images |
| 7 | Footer: Get in touch, contact, links | navy | |

Measured page height (production build, headless Chrome):

| Width | Height | Viewport heights |
| --- | --- | --- |
| 1440 × 900 | 6038px | 6.7 |
| 768 × 1024 | ≈8900px before the tablet card-row change (now shorter) | ≈8.7 |
| 375 × 812 | 7281px | 9.0 |

Section padding is `--space-section` (56px phone to 88px desktop); neighbouring sections never share a ground,
so paddings never stack on one colour.

## Copied interaction: ACN's button

`components/ui.tsx` `Button`, styled in `styles/ui.css`. From ACN's stylesheet:

```css
.new-button { border: 1px solid var(--colors--text); background-color: var(--colors--surface);
  box-shadow: 0 0 0 0 var(--colors--text); padding: .63em 2em;
  transition: box-shadow .2s, transform .2s, opacity .3s; }
.new-button:hover { box-shadow: 6px 6px 0 0 var(--colors--text); transform: translate(-6px, -6px); }
```

Same element shape (`<a class="btn"><span class="btn-text">`), same padding, same 6px lift and hard shadow, same
0.2s on `ease`. The values are variables (`--btn-shift`, `--btn-dur`, `--btn-ease`). ACN's variants map to tones:
default → `line` (follows currentColor, so it works in the header on any ground), `.cc-blue-shadow` → `navy` (lime
shadow), `.cc-green` → `lime`, the dark band's outline → `white`. Focus-visible gets the same lift.

## Preloader

`components/Preloader.tsx`, one GSAP timeline, 1.75s:

| Time | Stage |
| --- | --- |
| 0.10–0.95s | **Build.** The lower swoosh opens from its right tip and the upper from its left (clip wipes), so the orbit turns once; L·I·B·R·A rise in 0.06s apart; the wave wipes across the A; the tagline clip-wipes open |
| 0.95–1.20s | **Hold** |
| 1.20–1.75s | **Exit.** The lock-up glides and scales into the header logo; the white ground fades over the hero, which opens on the same white |

Why this build: the logo is a wordmark held in an orbit, not a tiled mark, so the orbit draws and the letters are
set inside it. Handover at 1.30s removes `is-loading`, sets `data-intro="done"` and dispatches `intro:done`; the hero
entrance (film panel clip-open, headline lines rising, header fade) starts on that event, so the two overlap. Lenis is
stopped until then. A 2.2s failsafe finishes it whatever happens. It plays once per browser session
(`sessionStorage` `libra-intro`; the boot script in `app/layout.tsx` checks the same key so a repeat visit never paints
it), never with reduced motion, and `<noscript>` hides it. It is `aria-hidden`.

Measured on the production build (headless Chrome, `performance.mark`s left in the component): starts 130ms after
navigation, handover at 1.29s, done at 1.75s (1.88s after navigation). First paint is the white preloader ground, so
there is no flash of the page or hero before it.

## Motion system

Lenis (1.1s, exponential ease-out) on the GSAP ticker, synced with ScrollTrigger. Overlays and the preloader stop it.
One curve family: ACN's `ease`, `cubic-bezier(.25,.1,.25,1)` (`lib/ease.ts`, `--ease`). Every reveal plays once;
in `[data-late]` sections durations are 75%.

| Move | Applies to | Motion |
| --- | --- | --- |
| `label` | eyebrows, buttons | 12px rise + fade, 0.5s |
| `heading` | section headlines (never split) | 24px rise + fade, 0.7s |
| `text` | long paragraphs | words rise out of line masks, 0.07s between lines, 0.7s |
| `card` | pillars, tiles, badges, rows, posts, footer columns | batched 24px rise + fade, 0.08s apart, 0.5s |
| `image` | Manchester film | clip opens from the bottom, 0.9s; `[data-parallax]` pillar photos drift ±5% |

Hover: photos ease to 1.05 scale (0.5s), arrows step 5 to 6px (0.3s), text links draw an underline (0.3s).
Per-character motion appears only in the preloader. Header: frameless; it takes white over the navy band and footer
and navy elsewhere (probe on full-width sections only), hides on scroll down and returns on scroll up. Menu: header
group names (or "Menu" under 1180px) open a full-screen navy menu (clip wipe down, items rise, `reverse()` out) with a
focus trap, Esc to close and focus returned to the trigger.

**Hero film:** muted, looped, `playsInline`, local poster, pause/play button (`aria-pressed`), pauses off-screen,
starts paused with reduced motion. The Manchester film is brightened in CSS (it was shot at dusk).

## Photography

All images are the live site's own (company site photos, film stills, post graphics and the tiles' images).
Two tiers (`scripts/media.sh`, decided with the client after a first pass that tinted everything navy):

- **Natural:** Libra's own imagery (hero and Manchester films, head office, tank farm, site aerial, the control
  room and reactor panel stills, post graphics) in its real colour, eased to 85% saturation. The footage is grey
  steel, white tanks and sky, so it sits beside navy and lime as it is. Films get the same easing in CSS.
- **Light tint:** the generic stock on the sector tiles and the lab glassware (pink jar, red triggers, orange sunset):
  a navy-to-white duotone mixed 70/30 with the original, so the grid reads as one set without looking filtered.

Accreditation marks are third-party logos shown in one navy ink, like ACN's member wall. The control room and reactor
panel photos are stills from the company film.

## Accessibility and fallbacks

Reduced motion: no Lenis, no preloader, no reveals, film paused. Without JS: no `js` class, so every reveal target
renders in place and the preloader is hidden. Skip link, visible focus rings (navy, lime on navy), 44px targets,
`aria-labelledby` on sections, alt text on content photos (decorative tiles use `alt=""` beside their names).
Contrast: navy on white 12:1, muted navy 6.4:1, white on navy 12:1, navy on lime 6.6:1.

## Private-demo settings

- `robots: noindex, nofollow, nocache` (layout metadata); no sitemap or robots route.
- PostHog EU (`lib/posthog.ts`): key from `NEXT_PUBLIC_POSTHOG_KEY` with the literal fallback, pageview, pageleave,
  autocapture, session recording, surveys disabled, `site` and UTM registration, `scroll_depth` at 25/50/75/100%
  (each once). No visible tracking UI, no cookie banner, no Regen branding.
- No em or en dashes in rendered text (checked against the built HTML).

## Verification (2026-10-02)

- `npm run typecheck` and `npm run build` pass; static pages: `/`, `/_not-found` (plus `/icon.svg`).
- Headless Chrome at 375, 768 and 1440 after scrolling the whole page: no horizontal overflow, no broken images,
  no reveal left hidden.
- Menu by keyboard: focus moves into the menu, Esc closes it, focus returns to the toggle.
- Links: every href is the canonical live URL; the homepage's own short tile links (`/personal-care/` etc.) 301 to
  the `/libra-applications/` addresses used here, and its `/applications-2` link 404s, so `/libra-applications/` is
  used instead.
