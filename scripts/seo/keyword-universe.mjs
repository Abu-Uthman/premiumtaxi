import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import locations from '../../src/data/locations.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const services = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/services.json'), 'utf8'));
const priorityPages = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/priorityPages.json'), 'utf8'));

const coreTerms = [
  'maxi taxi',
  'maxi cab',
  'taxi',
  'cab',
  'airport taxi',
  'melbourne airport taxi',
  'melbourne airport transfer',
  'tullamarine airport taxi',
  'avalon airport taxi'
];

const serviceTerms = [
  'baby seat taxi',
  'taxi with baby seat',
  'child seat taxi',
  'wheelchair taxi',
  'wheelchair accessible taxi',
  'parcel delivery taxi',
  'corporate taxi',
  'corporate transfers',
  'school taxi',
  'school runs taxi',
  'student transport taxi',
  'cruise transfer',
  'station pier taxi',
  'event taxi',
  'wedding transfer taxi',
  'suv taxi',
  'wagon taxi',
  'silver service taxi',
  'group transfers',
  'private taxi tour'
];

const suffixIntents = [
  'near me',
  'melbourne',
  'melbourne airport',
  'to melbourne airport',
  'from melbourne airport',
  'with luggage',
  'for 7 passengers',
  'for 11 passengers',
  'pre book',
  '24 hour',
  'price',
  'quote'
];

const priorityLocationSlugs = new Set(priorityPages.flatMap((page) => page.locationSlugs || []));
const priorityLocations = locations.filter((loc) => priorityLocationSlugs.has(loc.slug));

export const keywordFamilies = [
  { id: 'maxiTaxi', label: 'Maxi Taxi', pattern: /\bmaxi taxi\b/ },
  { id: 'maxiCab', label: 'Maxi Cab', pattern: /\bmaxi cab\b/ },
  { id: 'airportTaxi', label: 'Airport Taxi / Airport Transfer', pattern: /\bairport taxi\b|\bairport transfer\b|\btullamarine\b|\bavalon\b/ },
  { id: 'babySeatTaxi', label: 'Baby-Seat Taxi', pattern: /\bbaby seat\b|\bchild seat\b|\btaxi with baby seat\b/ },
  { id: 'wheelchairTaxi', label: 'Wheelchair Taxi', pattern: /\bwheelchair\b|\baccessible taxi\b/ },
  { id: 'parcelTaxi', label: 'Parcel Taxi', pattern: /\bparcel\b|\bcourier\b|\bdelivery taxi\b/ },
  { id: 'corporateTaxi', label: 'Corporate Taxi', pattern: /\bcorporate\b|\bbusiness\b|\bexecutive\b/ },
  { id: 'schoolTaxi', label: 'School Taxi / Student Transport', pattern: /\bschool\b|\bstudent\b/ },
  { id: 'cruiseTransfer', label: 'Cruise Transfer', pattern: /\bcruise\b|\bstation pier\b/ },
  { id: 'suvWagon', label: 'SUV / Wagon Taxi', pattern: /\bsuv\b|\bwagon\b/ },
  { id: 'silverService', label: 'Silver Service', pattern: /\bsilver service\b/ },
  { id: 'groupLuggage', label: 'Group / Luggage Taxi', pattern: /\bgroup\b|\bluggage\b|\b7 passengers\b|\b11 passengers\b/ },
  { id: 'suburbService', label: 'Suburb-Service Combination', pattern: null }
];

function normalizeKeyword(keyword) {
  return keyword
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleKeyword(keyword) {
  return normalizeKeyword(keyword).replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildKeywordUniverse() {
  const keywords = new Map();

  function add(keyword, source, priority = 50, familyHint = null) {
    const normalized = normalizeKeyword(keyword);
    if (!normalized || normalized.length > 120) return;
    const familyIds = detectKeywordFamilies(normalized, familyHint);
    const existing = keywords.get(normalized);
    if (existing) {
      existing.sources = Array.from(new Set([...existing.sources, source]));
      existing.priority = Math.max(existing.priority, priority);
      existing.families = Array.from(new Set([...existing.families, ...familyIds]));
      return;
    }
    keywords.set(normalized, {
      keyword: normalized,
      label: titleKeyword(normalized),
      sources: [source],
      families: familyIds,
      priority
    });
  }

  for (const term of coreTerms) {
    const priority = term === 'maxi taxi' ? 120 : term === 'maxi cab' ? 118 : term.includes('airport') ? 112 : 90;
    add(`${term} melbourne`, 'core', priority);
    for (const intent of suffixIntents) add(`${term} ${intent}`, 'core-intent', priority - 10);
  }

  for (const term of serviceTerms) {
    const priority = term.includes('baby') || term.includes('wheelchair') ? 110 : term.includes('parcel') || term.includes('corporate') ? 104 : 98;
    add(`${term} melbourne`, 'service', priority);
    add(`${term} near me`, 'service-near-me', 85);
    add(`${term} melbourne airport`, 'service-airport', 85);
  }

  for (const service of services) {
    add(service.name, 'existing-service', 90);
    add(service.title.split('|')[0], 'existing-service-title', 80);
  }

  for (const location of locations) {
    add(`taxi ${location.name}`, 'location-taxi', 70);
    add(`maxi taxi ${location.name}`, 'location-maxi-taxi', 96, 'suburbService');
    add(`maxi cab ${location.name}`, 'location-maxi-cab', 94, 'suburbService');
    add(`airport taxi ${location.name}`, 'location-airport', 88, 'suburbService');
    add(`taxi ${location.name} to melbourne airport`, 'location-airport-intent', 75);
  }

  for (const location of priorityLocations) {
    add(`baby seat taxi ${location.name}`, 'priority-location-baby-seat', 108, 'suburbService');
    add(`wheelchair taxi ${location.name}`, 'priority-location-wheelchair', 106, 'suburbService');
    add(`maxi taxi ${location.name}`, 'priority-location-maxi-taxi', 112, 'suburbService');
    add(`maxi cab ${location.name}`, 'priority-location-maxi-cab', 110, 'suburbService');
    add(`airport taxi ${location.name}`, 'priority-location-airport', 90);
  }

  for (const page of priorityPages) {
    add(page.h1, 'existing-priority-page', 100);
    add(page.title.split('|')[0], 'existing-priority-title', 95);
  }

  return [...keywords.values()].sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
}

export function detectKeywordFamilies(keyword, familyHint = null) {
  const ids = keywordFamilies
    .filter((family) => family.pattern && family.pattern.test(keyword))
    .map((family) => family.id);
  if (familyHint) ids.push(familyHint);
  if (locations.some((location) => keyword.includes(location.name.toLowerCase())) && !ids.includes('suburbService')) {
    ids.push('suburbService');
  }
  return ids.length ? Array.from(new Set(ids)) : ['generalTaxi'];
}

export function summarizeKeywordUniverse(keywords = buildKeywordUniverse()) {
  const familyCounts = keywordFamilies.map((family) => {
    const matching = keywords.filter((item) => item.families.includes(family.id));
    return {
      id: family.id,
      label: family.label,
      count: matching.length,
      examples: matching.slice(0, 8).map((item) => item.keyword)
    };
  });

  const uncategorized = keywords.filter((item) => item.families.includes('generalTaxi'));
  return {
    totalKeywords: keywords.length,
    selectedByDefault: {
      sampleKeywords: 18,
      aggressiveKeywords: keywords.length,
      aggressiveSerps: 80,
      aggressiveLocal: 60
    },
    familyCounts,
    uncategorizedCount: uncategorized.length,
    topKeywords: keywords.slice(0, 40)
  };
}

export function selectKeywords({ mode, limit }, type = 'keywords') {
  const universe = buildKeywordUniverse();
  const defaultLimits = {
    sample: { keywords: 18, serps: 8, local: 8 },
    aggressive: { keywords: Infinity, serps: 80, local: 60 }
  };
  const count = Number.isFinite(limit) ? limit : defaultLimits[mode][type];
  return universe.slice(0, count);
}
