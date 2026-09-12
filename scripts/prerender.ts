import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "../src/App";
import { getSeoForPath, renderSeoHead } from "../src/lib/seo";
import { getAllRoutes } from "../src/lib/detail-items";

const SEO_START = "<!-- SEO:START -->";
const SEO_END = "<!-- SEO:END -->";

const distDir = resolve(process.cwd(), "dist");
const template = readFileSync(join(distDir, "index.html"), "utf-8");

function injectSeo(html: string, path: string): string {
  const seo = getSeoForPath(path);
  if (!seo) return html;

  const startIdx = html.indexOf(SEO_START);
  const endIdx = html.indexOf(SEO_END);
  if (startIdx === -1 || endIdx === -1) return html;

  return html.slice(0, startIdx) + SEO_START + "\n    " + renderSeoHead(seo) + "\n    " + html.slice(endIdx);
}

function injectBody(html: string, bodyHtml: string): string {
  return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

let count = 0;
for (const path of getAllRoutes()) {
  const bodyHtml = renderToString(
    createElement(StaticRouter, { location: path }, createElement(AppRoutes)),
  );

  const html = injectBody(injectSeo(template, path), bodyHtml);

  const outDir = path === "/" ? distDir : join(distDir, path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  count++;
}

console.log(`Prerendered ${count} pages.`);
