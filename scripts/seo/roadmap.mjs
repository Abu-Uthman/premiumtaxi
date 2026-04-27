import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import locations from '../../src/data/locations.js';
import { nowIso, readJson, writeJson, writeText } from './config.mjs';
import { buildKeywordUniverse, summarizeKeywordUniverse } from './keyword-universe.mjs';
import { formatMoney, listItems, markdownTable } from './report-utils.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const services = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/services.json'), 'utf8'));
const priorityPages = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/priorityPages.json'), 'utf8'));

const keywordsReport = readJson('keywords.json', { keywords: [] });
const competitorsReport = readJson('competitors.json', { organicCompetitors: [], localCompetitors: [] });
const keywordUniverse = buildKeywordUniverse();
const keywordUniverseSummary = summarizeKeywordUniverse(keywordUniverse);

const existingPrioritySlugs = new Set(priorityPages.map((page) => page.slug));
const existingServiceSlugs = new Set(services.map((service) => service.slug));
const serviceBySlug = new Map(services.map((service) => [service.slug, service]));
const locationBySlug = new Map(locations.map((location) => [location.slug, location]));

function slugify(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function inferIntent(keyword) {
  if (/baby|child/.test(keyword)) return 'baby-seat-taxi-melbourne';
  if (/wheelchair|accessible/.test(keyword)) return 'wheelchair-accessible-taxi-melbourne';
  if (/parcel|courier|delivery/.test(keyword)) return 'parcel-delivery-taxi-melbourne';
  if (/corporate|business|executive/.test(keyword)) return 'corporate-transfers-melbourne';
  if (/school|student/.test(keyword)) return 'school-runs-student-transport-melbourne';
  if (/cruise|station pier/.test(keyword)) return 'cruise-transfer-melbourne';
  if (/suv|wagon|silver/.test(keyword)) return keyword.includes('silver') ? 'silver-service-taxi-melbourne' : 'suv-wagon-taxi-melbourne';
  if (/group|7 passengers|11 passengers|maxi/.test(keyword)) return 'maxi-cab-melbourne';
  return 'maxi-cab-melbourne';
}

function inferLocation(keyword) {
  return locations.find((location) => keyword.includes(location.name.toLowerCase())) || null;
}

function inferLandingSlug(keyword, serviceSlug, location) {
  if (!location) return slugify(keyword);

  if (/\bmaxi taxi\b/.test(keyword)) return slugify(`maxi taxi ${location.name}`);
  if (/\bmaxi cab\b/.test(keyword)) return slugify(`maxi cab ${location.name}`);
  if (/\bairport taxi\b|\bairport transfer\b|\btullamarine\b|\bavalon\b/.test(keyword)) return slugify(`airport taxi ${location.name}`);
  if (/\bbaby seat\b|\bchild seat\b|\btaxi with baby seat\b/.test(keyword)) return slugify(`baby seat taxi ${location.name}`);
  if (/\bwheelchair\b|\baccessible taxi\b/.test(keyword)) return slugify(`wheelchair taxi ${location.name}`);
  if (/\bparcel\b|\bcourier\b|\bdelivery taxi\b/.test(keyword)) return slugify(`parcel delivery ${location.name}`);
  if (/\bcorporate\b|\bbusiness\b|\bexecutive\b/.test(keyword)) return slugify(`corporate transfers ${location.name}`);
  if (/\bschool\b|\bstudent\b/.test(keyword)) return slugify(`school runs ${location.name}`);
  if (/\bcruise\b|\bstation pier\b/.test(keyword)) return slugify(`cruise transfer ${location.name}`);
  if (/\bsuv\b|\bwagon\b/.test(keyword)) return slugify(`suv wagon taxi ${location.name}`);
  if (/\bsilver service\b/.test(keyword)) return slugify(`silver service taxi ${location.name}`);
  if (/\bcab\b/.test(keyword)) return slugify(`cab ${location.name}`);
  if (/\btaxi\b/.test(keyword)) return slugify(`taxi ${location.name}`);

  const service = serviceBySlug.get(serviceSlug);
  return slugify(`${service?.name || 'taxi'} ${location.name}`);
}

const rankedKeywords = (keywordsReport.keywords || [])
  .filter((item) => (item.searchVolume || 0) > 0 || (item.cpc || 0) > 0)
  .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0) || (b.cpc || 0) - (a.cpc || 0));

const pageCandidates = rankedKeywords.map((item) => {
  const serviceSlug = inferIntent(item.keyword);
  const location = inferLocation(item.keyword);
  const slug = inferLandingSlug(item.keyword, serviceSlug, location);
  const exists = existingPrioritySlugs.has(slug);
  const serviceExists = existingServiceSlugs.has(slug);
  return {
    keyword: item.keyword,
    searchVolume: item.searchVolume,
    cpc: item.cpc,
    competition: item.competition,
    recommendedSlug: slug,
    recommendedServiceSlug: serviceSlug,
    recommendedLocationSlug: location?.slug || null,
    status: exists ? 'improve-existing-priority-page' : serviceExists ? 'improve-existing-service-page' : 'candidate-new-priority-page'
  };
});

const topOrganicCompetitors = (competitorsReport.organicCompetitors || []).slice(0, 20);
const topLocalCompetitors = (competitorsReport.localCompetitors || []).slice(0, 20);

const aeoQuestions = keywordUniverse
  .filter((item) => /price|quote|near me|to melbourne airport|from melbourne airport|with luggage|for 7 passengers|24 hour/.test(item.keyword))
  .slice(0, 80)
  .map((item) => ({
    question: item.keyword.includes('price') || item.keyword.includes('quote')
      ? `How much is ${item.keyword.replace(/\b(price|quote)\b/g, '').trim()}?`
      : `Can I book ${item.keyword}?`,
    targetKeyword: item.keyword,
    answerPattern: 'Give a direct two-sentence answer, then link to the most relevant service and suburb page.'
  }));

writeJson('contentGaps.json', {
  generatedAt: nowIso(),
  topKeywordOpportunities: pageCandidates.slice(0, 80),
  missingPriorityPageCandidates: pageCandidates.filter((item) => item.status === 'candidate-new-priority-page').slice(0, 60),
  improveExistingPriorityPages: pageCandidates.filter((item) => item.status.startsWith('improve-existing')).slice(0, 60),
  aeoQuestions
});

writeJson('seoRoadmap.json', {
  generatedAt: nowIso(),
  summary: {
    keywordRows: rankedKeywords.length,
    organicCompetitors: topOrganicCompetitors.length,
    localCompetitors: topLocalCompetitors.length,
    existingServices: services.length,
    existingLocations: locations.length,
    existingPriorityPages: priorityPages.length
  },
  priorities: [
    'Strengthen pages for keywords with search volume, CPC, and repeated competitor pressure.',
    'Build or improve local AEO blocks for airport, baby-seat, wheelchair, group, cruise, and parcel intent.',
    'Prepare GBP categories, services, photos, posts, and review prompts around the highest-frequency local-pack terms.',
    'Use competitor frequency, not one-off rankings, to decide which sites are truly top competitors.'
  ],
  topOrganicCompetitors,
  topLocalCompetitors,
  pageCandidates: pageCandidates.slice(0, 120),
  gbpPreparation: {
    recommendedCategories: ['Taxi service', 'Transportation service', 'Airport shuttle service'],
    serviceLabels: services.map((service) => service.name),
    weeklyPostThemes: [
      'Melbourne Airport maxi taxi bookings',
      'Baby seat taxi for family airport trips',
      'Wheelchair-accessible taxi requests',
      'Point Cook, Tarneit, Werribee, Dandenong and Tullamarine service-area posts',
      'Cruise and Station Pier transfers',
      'Group transport for events and luggage-heavy trips'
    ],
    photoPlan: [
      'Vehicle exterior',
      'Interior seating',
      'Baby seat setup',
      'Luggage space',
      'Wheelchair/accessibility setup when available',
      'Airport and hotel-style transfer context'
    ],
    reviewPromptGuidance: 'Ask real customers to mention the actual trip type and suburb if they are comfortable. Do not script, gate, or incentivise reviews.'
  }
});

const familyRows = keywordUniverseSummary.familyCounts.map((family) => [
  family.label,
  family.count,
  family.examples.slice(0, 4).join(', ')
]);

const candidateRows = pageCandidates.slice(0, 50).map((item, index) => [
  index + 1,
  item.keyword,
  item.searchVolume || '',
  formatMoney(item.cpc),
  item.competition || '',
  item.status,
  item.recommendedSlug
]);

const organicRows = topOrganicCompetitors.slice(0, 15).map((item, index) => [
  index + 1,
  item.domain,
  item.score,
  item.keywordCount,
  item.top3,
  item.top10
]);

const localRows = topLocalCompetitors.slice(0, 15).map((item, index) => [
  index + 1,
  item.business,
  item.domain || '',
  item.score,
  item.keywordCount,
  item.top3
]);

writeText('seoRoadmap.md', `
# SEO, AEO and GBP Roadmap

Generated: ${nowIso()}

## Keyword Universe

- Total generated keywords: ${keywordUniverseSummary.totalKeywords}
- Aggressive keyword mode researches: ${keywordUniverseSummary.selectedByDefault.aggressiveKeywords} keywords
- Primary money family: Maxi Taxi

${markdownTable(['Family', 'Count', 'Examples'], familyRows)}

## Keyword Opportunities

${candidateRows.length ? markdownTable(['#', 'Keyword', 'Volume', 'CPC', 'Competition', 'Action', 'Recommended Slug'], candidateRows) : 'No keyword metrics yet. Run `npm run seo:keywords`, then `npm run seo:roadmap`.'}

## Organic Competitors

${organicRows.length ? markdownTable(['#', 'Domain', 'Score', 'Keyword Count', 'Top 3', 'Top 10'], organicRows) : 'No organic competitor data yet. Run `npm run seo:serps`, `npm run seo:competitors`, then `npm run seo:roadmap`.'}

## Local Pack / GBP Competitors

${localRows.length ? markdownTable(['#', 'Business', 'Domain', 'Score', 'Keyword Count', 'Top 3'], localRows) : 'No local pack competitor data yet. Run `npm run seo:local`, `npm run seo:competitors`, then `npm run seo:roadmap`.'}

## AEO Question Targets

${listItems(aeoQuestions.slice(0, 40).map((item) => `${item.question} -> ${item.targetKeyword}`))}

## GBP Preparation

- Recommended categories: Taxi service, Transportation service, Airport shuttle service
- Photo plan: vehicle exterior, interior seating, baby seat setup, luggage space, accessibility setup when available, airport/hotel transfer context
- Review guidance: ask real customers to mention the actual trip type and suburb if they are comfortable; do not script, gate, or incentivise reviews.
`);

console.log('Wrote contentGaps.json, seoRoadmap.json and seoRoadmap.md to src/data/seoResearch/');
