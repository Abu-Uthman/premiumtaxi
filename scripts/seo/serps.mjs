import { DataForSeoClient, extractFirstResult } from './dataforseo-client.mjs';
import { dataForSeoDefaults, handleCliError, nowIso, parseArgs, writeJson } from './config.mjs';
import { selectKeywords } from './keyword-universe.mjs';

async function main() {
  const args = parseArgs();
  const selected = selectKeywords(args, 'serps');

  if (args.dryRun) {
    console.log(JSON.stringify({ mode: args.mode, count: selected.length, keywords: selected.map((item) => item.keyword) }, null, 2));
    return;
  }

  const client = new DataForSeoClient();
  const serps = [];

  for (const item of selected) {
    const response = await client.post('/serp/google/organic/live/advanced', [
      {
        keyword: item.keyword,
        location_name: dataForSeoDefaults.locationName,
        language_code: dataForSeoDefaults.languageCode,
        depth: dataForSeoDefaults.organicDepth,
        device: args.device || dataForSeoDefaults.device,
        os: dataForSeoDefaults.os
      }
    ]);

    const result = extractFirstResult(response);
    const items = result?.items || [];
    serps.push({
      keyword: item.keyword,
      seed: item,
      checkUrl: result?.check_url || null,
      apiCost: response.cost ?? null,
      items: items.map((serpItem) => ({
        type: serpItem.type,
        rankGroup: serpItem.rank_group ?? null,
        rankAbsolute: serpItem.rank_absolute ?? null,
        domain: serpItem.domain || null,
        title: serpItem.title || null,
        url: serpItem.url || null,
        breadcrumb: serpItem.breadcrumb || null,
        description: serpItem.description || null,
        snippet: serpItem.snippet || null,
        rating: serpItem.rating || null,
        cid: serpItem.cid || null,
        featureId: serpItem.feature_id || null
      }))
    });
  }

  writeJson('serps.json', {
    generatedAt: nowIso(),
    provider: 'DataForSEO Google Organic Live Advanced',
    locationName: dataForSeoDefaults.locationName,
    languageCode: dataForSeoDefaults.languageCode,
    mode: args.mode,
    requested: selected.length,
    serps
  });

  console.log(`Wrote ${serps.length} SERP result sets to src/data/seoResearch/serps.json`);
}

main().catch(handleCliError);
