import { keywordFamilies } from './keyword-universe.mjs';

export function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [headerLine, divider, ...body].join('\n');
}

export function listItems(items, fallback = 'No data yet.') {
  if (!items?.length) return fallback;
  return items.map((item) => `- ${item}`).join('\n');
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toFixed(2);
}

export function familyLabel(id) {
  return keywordFamilies.find((family) => family.id === id)?.label || id;
}

