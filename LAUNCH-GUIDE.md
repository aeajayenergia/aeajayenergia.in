# AeaJay Energia - Launch Guide

Two parts: getting the site found in India, and getting it online. Written to be
followed in order.

---

## Part 1: SEO focused on India

### What is already in the page

The code now carries clear India and Kerala signals:

- `<html lang="en-IN">` tells search engines this is Indian English.
- Geo meta tags: `geo.region = IN-KL` (Kerala), placename Thrissur, and
  latitude/longitude coordinates.
- `LocalBusiness` structured data with the address in Thrissur, Kerala, India,
  a PIN code, `areaServed` set to both Kerala and India, `currenciesAccepted`
  set to INR, and geo coordinates.
- Title, description and keywords all naming Thrissur, Kerala and India, plus
  local terms buyers actually search: PM Surya Ghar, KSEB, net metering,
  solar panel price.
- `og:locale` is `en_IN`.

### What you must correct before launch

These are placeholders. Wrong values here actively hurt local ranking.

1. **Coordinates and PIN code.** The page currently uses Thrissur city centre
   (10.5276, 76.2144) and PIN 680001. Get Alan's real business location. If he
   works from home or has no shopfront, use the town centre nearest to where he
   actually operates. Update in two places in `index.html`: the `geo.position`
   and `ICBM` meta tags, and the `geo` block plus `postalCode` in the
   LocalBusiness schema.

2. **Street address.** The schema has locality, region, PIN and country but no
   `streetAddress`. Add it once Alan is comfortable publishing it. If he does
   not want a street address public, leaving it out is fine, the locality and
   PIN still anchor him to Thrissur.

3. **Phone number format.** Already correct as `+91-8891369913`. Leave the
   country code in.

### The single biggest lever: Google Business Profile

This matters more for a local solar company than anything on the website
itself. When someone in Thrissur searches "solar installation near me", Google
shows the map pack first, and only Business Profiles appear there, not websites.

Steps:

1. Go to `https://www.google.com/business` and sign in with Alan's business
   Google account (the same `aeajayenergysolutions@gmail.com` is fine).
2. Create a profile for AeaJay Energia. Category: "Solar energy company" or
   "Solar panel installation".
3. Set the service area to the districts he covers (Thrissur, and any nearby
   districts like Ernakulam, Palakkad, Malappuram if he serves them).
4. Add the phone, the website URL once live, and business hours.
5. Google mails or calls a verification code. Complete verification.
6. Add real photos of completed jobs as they happen. Profiles with photos get
   far more calls.

Once the site is live, put the exact same business name, address and phone on
the website and the profile. Consistency between the two is what Google trusts.

### After the site is live

1. **Google Search Console** (`https://search.google.com/search-console`). Add
   the property, verify it (Vercel makes this easy, see Part 2), and submit
   `https://YOURDOMAIN/sitemap.xml`. This is how Google discovers the page fast
   instead of waiting weeks.
2. **Bing Webmaster Tools** (`https://www.bing.com/webmasters`). Same idea,
   smaller but free traffic. You can import directly from Search Console.
3. **Test the structured data** at `https://search.google.com/test/rich-results`.
   Paste the live URL. The FAQ should be eligible for rich results, which means
   the questions can show directly in search.
4. **Local directories.** List the business on JustDial and Sulekha, which
   Indians use heavily for local services, and on IndiaMART if Alan wants
   commercial and industrial leads. Use the identical name, address and phone
   every time.

### Ongoing, low effort

- Ask happy customers to leave a Google review. Reviews are the strongest local
  ranking signal after the profile itself. Even five genuine reviews move the
  needle in a town like Thrissur.
- When Alan finishes a notable install, a short photo post on the Business
  Profile keeps it active, which Google rewards.

You do not need blogging or link building to rank locally for this business.
The profile, consistent details, and reviews do almost all the work.

---

## Part 2: Domain and hosting

### The short version

Buy the domain, deploy the site free on Vercel, point the domain at Vercel.
Total cost is the domain only, roughly Rs 700 to Rs 1,200 a year. Hosting is
free at this size.

### Step 1: Choose and buy the domain

**What to buy.** A `.in` or `.com` for AeaJay Energia. Options in likely order
of preference:

- `aeajayenergia.com` - cleanest, works everywhere.
- `aeajayenergia.in` - strong local signal for India, often cheaper.
- `aeajayenergy.com` or similar if the exact name is taken.

Buying both the `.com` and the `.in` and pointing one at the other is cheap
insurance against a competitor taking the twin. Not essential.

**Where to buy.** Any of these are fine. Prices are indicative, INR per year.

| Registrar | Notes | Rough .com / .in first year |
|---|---|---|
| **Cloudflare Registrar** | Sells at cost, no markup, no upsells. Best price long term. Needs a free Cloudflare account. | ~Rs 900 / not always offered |
| **Namecheap** | Simple, honest pricing, good interface. Widely recommended. | ~Rs 800 / ~Rs 600 |
| **GoDaddy** | Cheap first year, jumps on renewal, heavy upselling. Common in India. | ~Rs 300 first year / ~Rs 500 |
| **BigRock / Hostinger** | India-based, INR billing, familiar support. | ~Rs 700 / ~Rs 500 |

Recommendation: **Namecheap** for a clean first purchase, or **Cloudflare** if
you are comfortable with a slightly more technical dashboard and want the lowest
ongoing cost. Avoid getting pulled into GoDaddy's hosting and email add-ons at
checkout, you do not need them.

**Watch the renewal price, not the first-year price.** GoDaddy in particular
sells year one cheap and renews high. Namecheap and Cloudflare are steadier.

### Step 2: Deploy the site on Vercel (free)

The site is static HTML, CSS and JS with no build step, so it fits Vercel's free
tier with room to spare. The project already contains a `vercel.json`.

1. Put the project in a **GitHub** repository. Create a free GitHub account if
   Alan or you do not have one. Upload the `aeajay-energia` folder as a new repo.
2. Create a free account at `https://vercel.com` and sign in with GitHub.
3. Click **Add New Project**, import the repository.
4. Framework preset: **Other**. Build command: leave empty. Output directory:
   leave empty. Click **Deploy**.
5. In under a minute the site is live on a free `something.vercel.app` URL. Test
   it thoroughly on that URL first.

### Step 3: Connect the domain to Vercel

1. In the Vercel project, go to **Settings, Domains**.
2. Type the domain you bought and click **Add**.
3. Vercel shows you either two nameservers or a set of DNS records (an A record
   and a CNAME).
4. Log in to the registrar from Step 1 and either:
   - point the domain's nameservers at the ones Vercel gave you, or
   - add the A and CNAME records Vercel listed.
5. Wait. DNS changes take anywhere from a few minutes to a few hours to spread.
   Vercel shows a green tick when it is ready.
6. Vercel issues a free HTTPS certificate automatically. The site will load on
   `https://` with no extra work.

### Step 4: Flip the placeholders to the real domain

Once the domain is attached, search the project for `aeajayenergia.com` and
replace every instance with the real domain. It appears in:

- `index.html`: canonical link, Open Graph tags, Twitter tags, both JSON-LD
  blocks.
- `robots.txt`
- `sitemap.xml`

Also set the real **Formspree** form ID in the contact form's `action`
attribute in `index.html`, or the form will refuse to send.

Commit and push to GitHub. Vercel redeploys automatically within a minute.

### What you do NOT need to buy

- **No separate web host.** Vercel is the host. Do not buy hosting from GoDaddy
  or BigRock, it would only complicate things and cost more.
- **No SSL certificate.** Vercel provides HTTPS free.
- **No CDN.** Vercel serves from a global edge network already.
- **Email hosting is optional.** The business currently uses a Gmail address,
  which is fine to launch with. If Alan later wants
  `alan@aeajayenergia.com`, that is a separate purchase (Google Workspace or
  Zoho Mail, Zoho has a free tier for one domain). It does not affect the
  website.

### Running cost summary

| Item | Cost |
|---|---|
| Domain | ~Rs 700 to Rs 1,200 per year |
| Hosting (Vercel free tier) | Rs 0 |
| HTTPS certificate | Rs 0 |
| Formspree (free tier, 50 submissions/month) | Rs 0 |
| **Total to launch and run** | **~Rs 1,000 per year** |

If contact form volume ever exceeds 50 submissions a month, Formspree's paid
tier or a switch to Vercel's own form handling would be the only added cost, and
that is a good problem to have.

---

## Launch checklist

- [ ] Confirm Alan's real location, PIN code and (optionally) street address
- [ ] Update coordinates, PIN and address in `index.html`
- [ ] Confirm Alan's real pricing and update `CONFIG` in `js/calculator.js`
- [ ] Buy the domain
- [ ] Create the Formspree form, put the real ID in `index.html`
- [ ] Push the project to GitHub
- [ ] Deploy on Vercel, test on the `.vercel.app` URL
- [ ] Attach the domain, wait for the green tick
- [ ] Replace every `aeajayenergia.com` placeholder with the real domain
- [ ] Create and verify the Google Business Profile
- [ ] Submit the sitemap in Google Search Console
- [ ] Test the page in the Rich Results tool
- [ ] Add a real, higher resolution hero image (current one is 1920px)
