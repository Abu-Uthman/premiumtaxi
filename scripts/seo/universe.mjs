import { nowIso, writeJson, writeText } from './config.mjs';
import { buildKeywordUniverse, summarizeKeywordUniverse } from './keyword-universe.mjs';
import { markdownTable } from './report-utils.mjs';

const keywords = buildKeywordUniverse();
const summary = summarizeKeywordUniverse(keywords);

writeJson('keywordUniverse.json', {
  generatedAt: nowIso(),
  ...summary,
  keywords
});

const familyRows = summary.familyCounts.map((family) => [
  family.label,
  family.count,
  family.examples.slice(0, 5).join(', ')
]);

const topRows = summary.topKeywords.slice(0, 60).map((item, index) => [
  index + 1,
  item.keyword,
  item.priority,
  item.families.join(', '),
  item.sources.join(', ')
]);

writeText('keywordUniverse.md', `
# Keyword Universe Report

Generated: ${nowIso()}

This report is created before any DataForSEO API call. It shows the full keyword universe the tooling can research for Melbourne maxi taxi, maxi cab, airport taxi, baby-seat taxi, wheelchair taxi, parcel, corporate, school, cruise, SUV/wagon, silver-service, and suburb-service keywords.

## Summary

- Total generated keywords: ${summary.totalKeywords}
- Sample keyword mode: ${summary.selectedByDefault.sampleKeywords}
- Aggressive keyword mode: ${summary.selectedByDefault.aggressiveKeywords} keywords
- Aggressive SERP mode: ${summary.selectedByDefault.aggressiveSerps} keywords
- Aggressive local mode: ${summary.selectedByDefault.aggressiveLocal} keywords

## Keyword Families

${markdownTable(['Family', 'Count', 'Examples'], familyRows)}

## Top Priority Keywords

${markdownTable(['#', 'Keyword', 'Priority', 'Families', 'Sources'], topRows)}
`);

console.log(`Wrote ${keywords.length} keywords to keywordUniverse.json and keywordUniverse.md`);
