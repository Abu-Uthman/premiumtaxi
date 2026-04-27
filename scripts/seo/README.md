# DataForSEO SEO Research Pipeline

This tooling discovers Melbourne maxi taxi, maxi cab, airport taxi, baby-seat taxi, wheelchair taxi, parcel, corporate, school, cruise, SUV/wagon, silver-service, and suburb-service keyword demand. It also finds real SERP competitors, local pack competitors, AEO questions, content gaps, and GBP preparation tasks.

## Credentials

Add credentials to `.env.local` or your shell environment:

```bash
DATAFORSEO_LOGIN=your-login
DATAFORSEO_PASSWORD=your-password
```

Do not commit real credentials. If credentials were shared in a chat or ticket, rotate the API password before production use.

## Commands

```bash
npm run seo:universe
npm run seo:keywords
npm run seo:serps
npm run seo:local
npm run seo:competitors
npm run seo:roadmap
```

Use sample mode while testing:

```bash
node scripts/seo/keywords.mjs --mode=sample
node scripts/seo/serps.mjs --mode=sample
node scripts/seo/local.mjs --mode=sample
```

Preview planned API work without calling DataForSEO:

```bash
node scripts/seo/universe.mjs
node scripts/seo/keywords.mjs --mode=aggressive --dry-run
node scripts/seo/serps.mjs --mode=aggressive --dry-run
```

Aggressive keyword mode uses the full generated keyword universe by default. SERP and local pack runs intentionally use smaller aggressive limits because each keyword creates a separate live SERP request.

## Outputs

Files are written to `src/data/seoResearch/`:

- `keywords.json`
- `keywordUniverse.json`
- `keywordUniverse.md`
- `serps.json`
- `localPack.json`
- `competitors.json`
- `competitors.md`
- `contentGaps.json`
- `seoRoadmap.json`
- `seoRoadmap.md`
