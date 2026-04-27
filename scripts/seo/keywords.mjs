import { DataForSeoClient, extractTasks } from './dataforseo-client.mjs';
import { dataForSeoDefaults, handleCliError, nowIso, parseArgs, writeJson } from './config.mjs';
import { selectKeywords } from './keyword-universe.mjs';

async function main() {
  const args = parseArgs();
  const selected = selectKeywords(args, 'keywords');

  if (args.dryRun) {
    console.log(JSON.stringify({ mode: args.mode, count: selected.length, keywords: selected.map((item) => item.keyword) }, null, 2));
    return;
  }

  const client = new DataForSeoClient();
  const response = await client.post('/keywords_data/google_ads/search_volume/live', [
    {
      location_name: dataForSeoDefaults.locationName,
      language_code: dataForSeoDefaults.languageCode,
      keywords: selected.map((item) => item.keyword)
    }
  ]);

  const task = extractTasks(response)[0] || {};
  const results = task.result || [];
  const byKeyword = new Map(selected.map((item) => [item.keyword, item]));

  const keywords = results.map((item) => ({
    keyword: item.keyword,
    searchVolume: item.search_volume ?? null,
    cpc: item.cpc ?? null,
    competition: item.competition ?? null,
    monthlySearches: item.monthly_searches || [],
    seed: byKeyword.get(item.keyword) || null
  })).sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0));

  writeJson('keywords.json', {
    generatedAt: nowIso(),
    provider: 'DataForSEO Google Ads Search Volume',
    locationName: dataForSeoDefaults.locationName,
    languageCode: dataForSeoDefaults.languageCode,
    mode: args.mode,
    requested: selected.length,
    returned: keywords.length,
    apiCost: response.cost ?? task.cost ?? null,
    keywords
  });

  console.log(`Wrote ${keywords.length} keyword metrics to src/data/seoResearch/keywords.json`);
}

main().catch(handleCliError);
