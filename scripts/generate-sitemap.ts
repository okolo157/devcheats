import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAllRoutes, TAB_PATHS } from "../src/lib/detail-items";
import { SITE_URL } from "../src/lib/seo";

const tabPaths = new Set<string>(TAB_PATHS);

const body = getAllRoutes()
  .map((path) => {
    const isTab = tabPaths.has(path);
    const priority = path === "/" ? "1.0" : isTab ? "0.8" : "0.6";
    const changefreq = isTab ? "weekly" : "monthly";
    return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const outPath = resolve(process.cwd(), "public/sitemap.xml");
writeFileSync(outPath, xml);
console.log(`Wrote sitemap with ${getAllRoutes().length} URLs to ${outPath}`);
