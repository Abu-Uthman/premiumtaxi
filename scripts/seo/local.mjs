import { DataForSeoClient, extractFirstResult } from './dataforseo-client.mjs';
import { dataForSeoDefaults, handleCliError, nowIso, parseArgs, writeJson } from './config.mjs';
import { selectKeywords } from './keyword-universe.mjs';

async function main() {
  const args = parseArgs();
  const selected = selectKeywords(args, 'local').filter((item) => /taxi|cab|transfer/.test(item.keyword));

  if (args.dryRun) {
    console.log(JSON.stringify({ mode: args.mode, count: selected.length, keywords: selected.map((item) => item.keyword) }, null, 2));
    return;
  }

  const client = new DataForSeoClient();
  const localPack = [];

  for (const item of selected) {
    const response = await client.post('/serp/google/maps/live/advanced', [
      {
        keyword: item.keyword,
        location_name: dataForSeoDefaults.locationName,
        language_code: dataForSeoDefaults.languageCode,
        depth: dataForSeoDefaults.mapsDepth,
        device: args.device || dataForSeoDefaults.device,
        os: dataForSeoDefaults.os
      }
    ]);

    const result = extractFirstResult(response);
    const items = result?.items || [];
    localPack.push({
      keyword: item.keyword,
      seed: item,
      checkUrl: result?.check_url || null,
      apiCost: response.cost ?? null,
      businesses: items.map((business) => ({
        rankGroup: business.rank_group ?? null,
        rankAbsolute: business.rank_absolute ?? null,
        title: business.title || null,
        category: business.category || null,
        address: business.address || null,
        phone: business.phone || null,
        url: business.url || null,
        domain: business.domain || null,
        cid: business.cid || null,
        placeId: business.place_id || null,
        featureId: business.feature_id || null,
        rating: business.rating || null,
        ratingValue: business.rating?.value ?? null,
        votesCount: business.rating?.votes_count ?? null,
        currentStatus: business.current_status || null
      }))
    });
  }

  writeJson('localPack.json', {
    generatedAt: nowIso(),
    provider: 'DataForSEO Google Maps Live Advanced',
    locationName: dataForSeoDefaults.locationName,
    languageCode: dataForSeoDefaults.languageCode,
    mode: args.mode,
    requested: selected.length,
    localPack
  });

  console.log(`Wrote ${localPack.length} local result sets to src/data/seoResearch/localPack.json`);
}

main().catch(handleCliError);
