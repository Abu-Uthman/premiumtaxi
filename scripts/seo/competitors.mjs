import { nowIso, readJson, writeJson, writeText } from './config.mjs';
import { markdownTable } from './report-utils.mjs';

const ownDomains = new Set(['premiummaxitaxi.com.au', 'premiumtaxi.vercel.app']);
const serps = readJson('serps.json', { serps: [] }).serps || [];
const localPack = readJson('localPack.json', { localPack: [] }).localPack || [];

function cleanDomain(domainOrUrl) {
  if (!domainOrUrl) return null;
  try {
    const hostname = domainOrUrl.startsWith('http') ? new URL(domainOrUrl).hostname : domainOrUrl;
    return hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return String(domainOrUrl).replace(/^www\./, '').toLowerCase();
  }
}

function getScoreForRank(rank, base) {
  if (!rank) return 0;
  return Math.max(1, base - rank);
}

const organic = new Map();
const local = new Map();

for (const serp of serps) {
  for (const item of serp.items || []) {
    if (!['organic', 'paid', 'featured_snippet'].includes(item.type)) continue;
    const domain = cleanDomain(item.domain || item.url);
    if (!domain || ownDomains.has(domain)) continue;

    const entry = organic.get(domain) || {
      domain,
      score: 0,
      keywordCount: 0,
      appearances: [],
      top3: 0,
      top10: 0
    };
    const rank = item.rankGroup || item.rankAbsolute || 99;
    entry.score += getScoreForRank(rank, item.type === 'featured_snippet' ? 70 : 55);
    entry.keywordCount += 1;
    if (rank <= 3) entry.top3 += 1;
    if (rank <= 10) entry.top10 += 1;
    entry.appearances.push({
      keyword: serp.keyword,
      type: item.type,
      rank,
      title: item.title,
      url: item.url,
      snippet: item.description || item.snippet
    });
    organic.set(domain, entry);
  }
}

for (const pack of localPack) {
  for (const business of pack.businesses || []) {
    const key = business.cid || business.placeId || business.title;
    if (!key) continue;
    const domain = cleanDomain(business.domain || business.url);
    if (domain && ownDomains.has(domain)) continue;

    const entry = local.get(key) || {
      business: business.title,
      domain,
      cid: business.cid,
      placeId: business.placeId,
      score: 0,
      keywordCount: 0,
      top3: 0,
      appearances: [],
      ratingValue: business.ratingValue,
      votesCount: business.votesCount,
      category: business.category
    };
    const rank = business.rankGroup || business.rankAbsolute || 99;
    entry.score += getScoreForRank(rank, 65);
    entry.keywordCount += 1;
    if (rank <= 3) entry.top3 += 1;
    entry.appearances.push({
      keyword: pack.keyword,
      rank,
      address: business.address,
      phone: business.phone,
      url: business.url,
      ratingValue: business.ratingValue,
      votesCount: business.votesCount
    });
    local.set(key, entry);
  }
}

const organicCompetitors = [...organic.values()].sort((a, b) => b.score - a.score);
const localCompetitors = [...local.values()].sort((a, b) => b.score - a.score);

writeJson('competitors.json', {
  generatedAt: nowIso(),
  scoring: {
    organic: 'Repeated organic/featured-snippet ranking frequency weighted by rank.',
    local: 'Repeated Google Maps/local visibility weighted by rank.',
    rule: 'A competitor is only treated as top-tier when it appears repeatedly across high-intent keywords.'
  },
  organicCompetitors,
  localCompetitors
});

const organicRows = organicCompetitors.slice(0, 30).map((item, index) => [
  index + 1,
  item.domain,
  item.score,
  item.keywordCount,
  item.top3,
  item.top10,
  item.appearances.slice(0, 3).map((appearance) => `${appearance.keyword} (#${appearance.rank})`).join('; ')
]);

const localRows = localCompetitors.slice(0, 30).map((item, index) => [
  index + 1,
  item.business,
  item.domain || '',
  item.score,
  item.keywordCount,
  item.top3,
  item.ratingValue || '',
  item.votesCount || '',
  item.appearances.slice(0, 3).map((appearance) => `${appearance.keyword} (#${appearance.rank})`).join('; ')
]);

writeText('competitors.md', `
# Competitor Report

Generated: ${nowIso()}

Competitors are scored by repeated visibility across high-intent keywords. A one-off ranking is not treated as a true top competitor.

## Organic Competitors

${organicRows.length ? markdownTable(['#', 'Domain', 'Score', 'Keyword Count', 'Top 3', 'Top 10', 'Sample Rankings'], organicRows) : 'No organic SERP data yet. Run `npm run seo:serps`, then `npm run seo:competitors`.'}

## Local Pack / GBP Competitors

${localRows.length ? markdownTable(['#', 'Business', 'Domain', 'Score', 'Keyword Count', 'Top 3', 'Rating', 'Reviews', 'Sample Rankings'], localRows) : 'No local pack data yet. Run `npm run seo:local`, then `npm run seo:competitors`.'}
`);

console.log(`Wrote ${organicCompetitors.length} organic and ${localCompetitors.length} local competitors to src/data/seoResearch/competitors.json`);
