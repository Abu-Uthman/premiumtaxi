import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const outputDir = path.join(repoRoot, 'src/data/seoResearch');

export const dataForSeoDefaults = {
  locationName: 'Melbourne,Victoria,Australia',
  languageCode: 'en',
  organicDepth: 50,
  mapsDepth: 40,
  device: 'mobile',
  os: 'ios'
};

export const runLimits = {
  sample: {
    keywords: 18,
    serps: 8,
    local: 8
  },
  aggressive: {
    keywords: 420,
    serps: 80,
    local: 60
  }
};

export function loadLocalEnv() {
  for (const filename of ['.env.local', '.env']) {
    const file = path.join(repoRoot, filename);
    if (!fs.existsSync(file)) continue;

    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (!process.env[key]) {
        process.env[key] = rest.join('=').replace(/^["']|["']$/g, '');
      }
    }
  }
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { mode: 'sample', dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    if (arg === '--mode') args.mode = argv[i + 1] || args.mode;
    if (arg.startsWith('--mode=')) args.mode = arg.split('=')[1];
    if (arg === '--limit') args.limit = Number(argv[i + 1]);
    if (arg.startsWith('--limit=')) args.limit = Number(arg.split('=')[1]);
    if (arg === '--device') args.device = argv[i + 1];
    if (arg.startsWith('--device=')) args.device = arg.split('=')[1];
  }

  if (!runLimits[args.mode]) {
    throw new Error(`Unsupported mode "${args.mode}". Use sample or aggressive.`);
  }

  return args;
}

export function getCredentials() {
  loadLocalEnv();
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error('Missing DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD. Add them to .env.local or the shell environment.');
  }

  return { login, password };
}

export function ensureOutputDir() {
  fs.mkdirSync(outputDir, { recursive: true });
}

export function writeJson(filename, payload) {
  ensureOutputDir();
  fs.writeFileSync(path.join(outputDir, filename), `${JSON.stringify(payload, null, 2)}\n`);
}

export function readJson(filename, fallback = null) {
  const file = path.join(outputDir, filename);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function nowIso() {
  return new Date().toISOString();
}

export function handleCliError(error) {
  console.error(`SEO tooling error: ${error.message}`);
  process.exitCode = 1;
}
