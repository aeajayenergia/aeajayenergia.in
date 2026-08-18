# AeaJay Energia

Single page marketing site for AeaJay Energia, a solar EPC based in Thrissur, Kerala.

Static HTML, CSS and JavaScript. No build step, no dependencies, no framework.

## Structure

```
aeajay-energia/
├── index.html                 Single page, all sections
├── css/
│   └── style.css              All styles
├── js/
│   ├── calculator.js          Savings estimator, all assumptions in CONFIG
│   └── main.js                Nav, accordion, form, scroll reveal
├── assets/
│   ├── logo/
│   │   ├── aeajay-logo.png            Transparent background, web sized
│   │   ├── aeajay-logo-white-bg.png   White background version
│   │   ├── sunburst.svg               Ray motif derived from the logo
│   │   ├── favicon-32.png
│   │   ├── favicon-512.png
│   │   └── apple-touch-icon.png
│   └── images/                Each image as .jpg with a .webp alongside
├── robots.txt
├── sitemap.xml
├── vercel.json
└── README.md
```

## Running locally

Opening `index.html` directly with `file://` works for layout, but the form
submission will not. Serve it over HTTP instead.

Python, already installed on most machines:

```bash
cd aeajay-energia
python -m http.server 8000
```

Then open `http://localhost:8000`.

Node, if you prefer:

```bash
npx serve
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, import the repository.
3. Framework preset: **Other**.
4. Build command: leave empty.
5. Output directory: leave empty, or set to `.` if Vercel asks.
6. Deploy.

`vercel.json` sets clean URLs, long cache headers on assets, and basic
security headers. Nothing else is needed.

## Before this goes live

### 1. Formspree endpoint

The contact form currently points at a placeholder and will refuse to send.

In `index.html`, find:

```html
<form ... action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Replace `YOUR_FORM_ID` with the real form ID from the Formspree dashboard.

### 2. Domain

The domain is not registered yet. Once it is, replace every occurrence of
`https://aeajayenergia.in` in the following files:

- `index.html` (canonical link, Open Graph tags, Twitter tags, both JSON-LD blocks)
- `robots.txt`
- `sitemap.xml`

### 3. Business address

The schema markup currently has locality and region only. Once Alan provides a
street address, add `streetAddress` and `postalCode` to the `PostalAddress`
block in the LocalBusiness JSON-LD in `index.html`. Google Business Profile
should be set up at the same time.

### 4. Testimonials

The three testimonial cards contain placeholder text. Replace the quote and the
`quote-name` and `quote-meta` values in the `#testimonials` section once real
customer quotes are available. If there will be fewer than three, delete the
extra `blockquote` elements. The grid handles one or two fine.

### 5. Calculator assumptions

Every number the calculator uses is in the `CONFIG` object at the top of
`js/calculator.js`. Nothing else needs editing.

Current placeholder assumptions:

| Setting | Residential | Commercial | Industrial |
|---|---|---|---|
| Effective tariff, Rs per unit | 7.0 | 8.5 | 7.5 |
| Installed cost, Rs per kW | 60,000 | 52,000 | 45,000 |
| Bill offset ratio | 0.90 | 0.75 | 0.70 |

Generation is assumed at 4.0 units per kW per day, averaged across the year
for Kerala.

Subsidy follows the PM Surya Ghar structure: Rs 30,000 per kW for the first
2 kW, Rs 18,000 for the third kW, capped at Rs 78,000. Residential only.

**These are industry rules of thumb, not Alan's numbers.** Confirm them with
him and update `CONFIG` before the site goes live, otherwise the site is making
promises the business has not agreed to. The subsidy rates in particular change
and should be verified against the current scheme.

## Design notes

Type is a single family: **Open Sans**, weights 400 to 800. Contrast comes from
weight and size rather than from a second typeface.

Two CSS variables point at it, `--display` and `--sans`. They currently hold the
same stack. They are kept separate so a different display face can be introduced
later by editing `--display` alone, without touching any selector.

The sunburst in `assets/logo/sunburst.svg` is the ray pattern from the logo,
redrawn as a standalone shape. It appears twice, as a CSS mask: bleeding off the
right of the hero at 16 percent opacity, and off the bottom left of the
calculator at 7 percent. It is decorative only and hidden from screen readers
and print.

No grid on the page is a 50/50 split. The imbalance is intentional and is what
keeps the layout from reading as a template.

## Screen sizes

The rem base scales up on large monitors (17px at 1700px wide, 18px at 2200px),
and the container widens from 1240px to 1400px, 1520px and 1640px as the screen
grows. This is what stops the layout sitting in a narrow column on a 27 inch
monitor. All sizing is in rem, so raising the base scales the whole page at once.

Short viewports, caused by browser zoom, display scaling or a laptop in
landscape, are handled by two height based media queries. Below 800px and again
below 680px of viewport height, the hero padding and headline shrink so the
call to action stays above the fold instead of being clipped.

The hero fills the full viewport height (`100svh`, with a `100vh` fallback for
older browsers). Above 1100px of viewport height the hero content is centred
rather than bottom aligned, so it is not stranded at the bottom of a very tall
image. On phones the hero is tightened so the primary call to action stays above
the fold.

## Known limitation: hero image resolution

The hero image is 1920px wide, which is the resolution of the source file. On a
2560px or wider monitor the browser upscales it and it will look slightly soft.
This cannot be fixed in code. Ask Alan for a higher resolution hero photo, at
least 2560px wide and ideally 3200px, and drop it in at
`assets/images/hero-solar-rooftop.jpg` with a matching `.webp`. Nothing else
needs changing.

## SEO

Already in place:

- Semantic heading hierarchy, one `h1`
- Title and meta description targeting Thrissur and Kerala solar terms
- Canonical URL
- Open Graph and Twitter card tags
- `LocalBusiness` JSON-LD with services, contact details and area served
- `FAQPage` JSON-LD matching the visible FAQ, eligible for rich results
- Descriptive alt text on every image
- WebP with JPG fallback, lazy loading below the fold
- `robots.txt` and `sitemap.xml`
- Mobile first, responsive down to 360px

Still to do once live:

- Register the domain and update all absolute URLs
- Submit the sitemap in Google Search Console
- Create and verify a Google Business Profile for Thrissur
- Replace placeholder testimonials with real ones
