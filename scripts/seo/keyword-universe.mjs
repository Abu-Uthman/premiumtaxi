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

  function add(keyword, source, priority = 50) {
    const normalized = normalizeKeyword(keyword);
    if (!normalized || normalized.length > 120) return;
    const existing = keywords.get(normalized);
    if (existing) {
      existing.sources = Array.from(new Set([...existing.sources, source]));
      existing.priority = Math.max(existing.priority, priority);
      return;
    }
    keywords.set(normalized, {
      keyword: normalized,
      label: titleKeyword(normalized),
      sources: [source],
      priority
    });
  }

  for (const term of coreTerms) {
    add(`${term} melbourne`, 'core', 100);
    for (const intent of suffixIntents) add(`${term} ${intent}`, 'core-intent', 90);
  }

  for (const term of serviceTerms) {
    add(`${term} melbourne`, 'service', 95);
    add(`${term} near me`, 'service-near-me', 85);
    add(`${term} melbourne airport`, 'service-airport', 85);
  }

  for (const service of services) {
    add(service.name, 'existing-service', 90);
    add(service.title.split('|')[0], 'existing-service-title', 80);
  }

  for (const location of locations) {
    add(`taxi ${location.name}`, 'location-taxi', 70);
    add(`maxi taxi ${location.name}`, 'location-maxi', 75);
    add(`maxi cab ${location.name}`, 'location-maxi', 75);
    add(`airport taxi ${location.name}`, 'location-airport', 70);
    add(`taxi ${location.name} to melbourne airport`, 'location-airport-intent', 75);
  }

  for (const location of priorityLocations) {
    add(`baby seat taxi ${location.name}`, 'priority-location-baby-seat', 92);
    add(`wheelchair taxi ${location.name}`, 'priority-location-wheelchair', 92);
    add(`maxi cab ${location.name}`, 'priority-location-maxi', 94);
    add(`airport taxi ${location.name}`, 'priority-location-airport', 90);
  }

  for (const page of priorityPages) {
    add(page.h1, 'existing-priority-page', 100);
    add(page.title.split('|')[0], 'existing-priority-title', 95);
  }

  return [...keywords.values()].sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
}

export function selectKeywords({ mode, limit }, type = 'keywords') {
  const universe = buildKeywordUniverse();
  const defaultLimits = {
    sample: { keywords: 18, serps: 8, local: 8 },
    aggressive: { keywords: 420, serps: 80, local: 60 }
  };
  const count = Number.isFinite(limit) ? limit : defaultLimits[mode][type];
  return universe.slice(0, count);
}
