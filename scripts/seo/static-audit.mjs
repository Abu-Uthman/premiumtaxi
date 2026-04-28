import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = "dist";
const site = "https://www.premiummaxicab.com.au/";
const warnTitleLength = 65;
const warnDescriptionLength = 165;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function routeToFile(path) {
  if (path.endsWith("/")) return join(root, path, "index.html");
  const last = path.split("/").pop() || "";
  return last.includes(".") ? join(root, path) : join(root, path, "index.html");
}

function htmlRoute(file) {
  const route = relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  return route === "" ? "/" : `/${route}`;
}

function firstMatch(source, pattern) {
  return source.match(pattern)?.[1]?.trim() || "";
}

if (!existsSync(root)) {
  console.error("dist/ does not exist. Run npm run build first.");
  process.exit(1);
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const titles = new Map();
const descriptions = new Map();
const errors = [];
const warnings = [];

for (const file of htmlFiles) {
  const source = readFileSync(file, "utf8");
  const route = htmlRoute(file);
  const title = firstMatch(source, /<title>([^<]*)<\/title>/).replace(/&amp;/g, "&");
  const description = firstMatch(source, /<meta name="description" content="([^"]*)"/).replace(/&amp;/g, "&");

  if (!title) errors.push(`${route}: missing <title>`);
  if (!description) errors.push(`${route}: missing meta description`);

  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(route);
    if (title.length > warnTitleLength) warnings.push(`${route}: title is ${title.length} chars`);
  }

  if (description) {
    if (!descriptions.has(description)) descriptions.set(description, []);
    descriptions.get(description).push(route);
    if (description.length > warnDescriptionLength) warnings.push(`${route}: description is ${description.length} chars`);
  }

  if (!source.includes(`<link rel="canonical" href="${site}`)) {
    errors.push(`${route}: missing canonical under ${site}`);
  }

  for (const match of source.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD: ${error.message}`);
    }
  }

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (
      url.startsWith("http") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("#") ||
      url.startsWith("data:")
    ) {
      continue;
    }

    if (url.startsWith("/")) {
      const cleanUrl = url.split("#")[0].split("?")[0];
      if (cleanUrl && !existsSync(routeToFile(cleanUrl))) {
        errors.push(`${route}: broken local reference ${url}`);
      }
    }
  }
}

for (const [title, routes] of titles.entries()) {
  if (routes.length > 1) errors.push(`duplicate title "${title}" on ${routes.join(", ")}`);
}

for (const [description, routes] of descriptions.entries()) {
  if (routes.length > 1) errors.push(`duplicate description "${description}" on ${routes.join(", ")}`);
}

console.log(`Static audit checked ${htmlFiles.length} HTML pages.`);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 80)) console.log(`- ${warning}`);
  if (warnings.length > 80) console.log(`- ... ${warnings.length - 80} more`);
}

if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Static audit passed.");
