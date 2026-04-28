import fs from "node:fs";
import path from "node:path";
import locations from "../../src/data/locations.js";
import services from "../../src/data/services.json" with { type: "json" };
import priorityPages from "../../src/data/priorityPages.json" with { type: "json" };

const root = process.cwd();
const sitemapPath = path.join(root, "dist", "sitemap-0.xml");

function findDuplicates(items) {
  const seen = new Map();
  const duplicates = [];

  for (const item of items) {
    if (!item.value) continue;
    const key = String(item.value).trim().toLowerCase();
    if (!key) continue;

    if (seen.has(key)) {
      duplicates.push([seen.get(key), item]);
    } else {
      seen.set(key, item);
    }
  }

  return duplicates;
}

function printDuplicates(label, duplicates) {
  if (!duplicates.length) {
    console.log(`OK ${label}: no duplicates`);
    return 0;
  }

  console.error(`DUPLICATES ${label}:`);
  for (const [first, second] of duplicates) {
    console.error(`- ${first.source} and ${second.source}: ${first.value}`);
  }
  return duplicates.length;
}

function sourceItems(records, field, prefix) {
  return records.map((record) => ({
    value: record[field],
    source: `${prefix}/${record.slug || record.name || "unknown"}`,
  }));
}

function sitemapUrls() {
  if (!fs.existsSync(sitemapPath)) {
    console.warn("SKIP sitemap URL duplicate check: run npm run build first");
    return [];
  }

  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => ({
    value: match[1],
    source: "dist/sitemap-0.xml",
  }));
}

let issueCount = 0;

issueCount += printDuplicates("location slugs", findDuplicates(sourceItems(locations, "slug", "locations")));
issueCount += printDuplicates("location names", findDuplicates(sourceItems(locations, "name", "locations")));
issueCount += printDuplicates("service slugs", findDuplicates(sourceItems(services, "slug", "services")));
issueCount += printDuplicates("service titles", findDuplicates(sourceItems(services, "title", "services")));
issueCount += printDuplicates("priority page slugs", findDuplicates(sourceItems(priorityPages, "slug", "taxi-services")));
issueCount += printDuplicates("priority page titles", findDuplicates(sourceItems(priorityPages, "title", "taxi-services")));
issueCount += printDuplicates("sitemap URLs", findDuplicates(sitemapUrls()));

if (issueCount > 0) {
  console.error(`Duplicate audit failed with ${issueCount} issue(s).`);
  process.exit(1);
}

console.log("Duplicate audit passed.");
