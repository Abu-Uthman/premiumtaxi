import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import locations from '../../src/data/locations.js';
import { nowIso, readJson, writeJson } from './config.mjs';
import { buildKeywordUniverse } from './keyword-universe.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const services = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/services.json'), 'utf8'));
const priorityPages = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/priorityPages.json'), 'utf8'));

const keywordsReport = readJson('keywords.json', { keywords: [] });
const competitorsReport = readJson('competitors.json', { organicCompetitors: [], localCompetitors: [] });

const existingPrioritySlugs = new Set(priorityPages.map((page) => page.slug));
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

const rankedKeywords = (keywordsReport.keywords || [])
  .filter((item) => (item.searchVolume || 0) > 0 || (item.cpc || 0) > 0)
  .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0) || (b.cpc || 0) - (a.cpc || 0));

const pageCandidates = rankedKeywords.map((item) => {
  const serviceSlug = inferIntent(item.keyword);
  const location = inferLocation(item.keyword);
  const service = serviceBySlug.get(serviceSlug);
  const slug = location ? slugify(`${service?.name || 'taxi'} ${location.name}`) : slugify(item.keyword);
  const exists = existingPrioritySlugs.has(slug);
  return {
    keyword: item.keyword,
    searchVolume: item.searchVolume,
    cpc: item.cpc,
    competition: item.competition,
    recommendedSlug: slug,
    recommendedServiceSlug: serviceSlug,
    recommendedLocationSlug: location?.slug || null,
    status: exists ? 'improve-existing-priority-page' : 'candidate-new-priority-page'
  };
});

const topOrganicCompetitors = (competitorsReport.organicCompetitors || []).slice(0, 20);
const topLocalCompetitors = (competitorsReport.localCompetitors || []).slice(0, 20);

const aeoQuestions = buildKeywordUniverse()
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
  improveExistingPriorityPages: pageCandidates.filter((item) => item.status === 'improve-existing-priority-page').slice(0, 60),
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

console.log('Wrote contentGaps.json and seoRoadmap.json to src/data/seoResearch/');
