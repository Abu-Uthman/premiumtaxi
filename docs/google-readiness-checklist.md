# Google Search Console and Business Profile Readiness

## Current Public Business Facts

- Business name: Premium Maxi Taxi Melbourne
- Website: https://www.premiummaxicab.com.au/
- Primary phone: 0424 438 088
- Second phone: (03) 8338 0283
- Email: book@premiummaxicab.com.au
- GBP type: service-area business
- Public address policy: address hidden for service-area bookings
- Service area: Melbourne and Victoria

These facts are centralized in `src/data/business.js`. Keep public site copy, JSON-LD, GBP setup, and Search Console references aligned to that file.

## Do Not Publish Until Verified

- Physical address
- Public storefront or depot claims
- Operating hours
- ABN, licence, accreditation, or insurance claims
- Review ratings, review counts, or testimonial claims
- Fleet counts
- Guaranteed response times

## Pre-Deploy Technical Checks

- Run `npm run build`.
- Run `npm run seo:audit`.
- Confirm `/robots.txt` allows crawling and references `https://www.premiummaxicab.com.au/sitemap-index.xml`.
- Confirm every indexable page has one canonical URL on `https://www.premiummaxicab.com.au/`.
- Confirm the Vercel primary production domain and source canonicals both use the same host.
- Confirm generated JSON-LD parses on home, contact, one service page, one location page, and one taxi-services page.
- Confirm generated service-area pages do not imply fake suburb offices.

## Search Console Launch Steps

- Verify the HTTPS domain property.
- Submit `https://www.premiummaxicab.com.au/sitemap-index.xml`.
- If the live site continues to redirect apex to `www`, use `https://www.premiummaxicab.com.au/` as the main URL-prefix property.
- Use URL Inspection on:
  - home,
  - contact,
  - `/services/maxi-cab-melbourne/`,
  - one suburb page,
  - one high-intent taxi-services page.
- Watch indexing, duplicate, discovered-currently-not-indexed, crawled-currently-not-indexed, and structured data reports after submission.

## Google Business Profile Launch Steps

- Set the profile as a service-area business unless a real customer-facing address is verified.
- Use the exact website business name, phone, email, and URL.
- Choose service categories that match published services.
- Add real vehicle and service photos only.
- Ask real customers for honest reviews without scripting, gating, or incentivising.

## Lead Handling Checklist

- Verify the Resend sender domain before launch.
- Set `RESEND_API_KEY`, `BOOKING_EMAIL_TO=awaledev36@gmail.com`, and `RESEND_FROM_EMAIL="Premium Maxi Taxi Melbourne <book@premiummaxicab.com.au>"` in Vercel.
- Set `CLOUDFLARE_TURNSTILE_SITE_KEY`, `PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` in Vercel before testing forms.
- Test `/api/send-email` from the deployed site.
- Add spam protection before paid traffic or aggressive GBP posting.
