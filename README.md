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
BOOKING_EMAIL_TO=booking@premiummaxitaxi.com.au
RESEND_FROM_EMAIL="Premium Maxi Taxi <booking@premiummaxitaxi.com.au>"
```

`RESEND_FROM_EMAIL` must use a domain verified in Resend before production emails can send reliably.

## SEO Structure

The site generates:

- Core service pages from `src/data/services.json`
- Location pages from `src/data/locations.js`
- High-intent service/location pages from `src/data/priorityPages.json`

Run `npm run build` before deployment to verify all generated routes.
