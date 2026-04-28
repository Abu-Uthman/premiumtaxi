# Premium Maxi Taxi

Astro website for Premium Maxi Taxi Victoria, focused on Melbourne and Victoria taxi, maxi cab, airport transfer, accessible transport, and regional trip search visibility.

## Stack

- Astro 6
- Static site generation
- Vercel deployment
- Resend email endpoint at `/api/send-email`
- Sitemap generation with `@astrojs/sitemap`

## Commands

```sh
npm install
npm run dev
npm run build
npm run seo:audit
npm run preview
```

## Deployment

This project is configured for Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.x`

Required Vercel environment variables for form emails:

```sh
RESEND_API_KEY=
BOOKING_EMAIL_TO=booking@premiummaxicab.com.au
RESEND_FROM_EMAIL="Premium Maxi Taxi <booking@premiummaxicab.com.au>"
```

`RESEND_FROM_EMAIL` must use a domain verified in Resend before production emails can send reliably.

## SEO Structure

The site generates:

- Core service pages from `src/data/services.json`
- Location pages from `src/data/locations.js`
- High-intent service/location pages from `src/data/priorityPages.json`

Run `npm run build` before deployment to verify all generated routes.

## Google Readiness

- Treat the business as a Google Business Profile service-area business.
- Keep the public address hidden unless a real customer-facing address is verified and approved for publication.
- Keep business name, phone, email, website, and service areas aligned with `src/data/business.js`.
- Do not add fake reviews, ratings, addresses, operating hours, licence numbers, ABNs, fleet counts, or response-time guarantees.
- Before Search Console submission, run `npm run build` and validate representative URLs in Google's Rich Results Test.
- Submit `https://premiummaxicab.com.au/sitemap-index.xml` only after generated page metadata and schema checks pass.
- Confirm the Resend sender domain before relying on `/api/send-email` in production.

See `docs/google-readiness-checklist.md` for the deployment, Search Console, GBP, and lead-handling checklist.
