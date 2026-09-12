import { useEffect } from "react";
import { getSeoForPath, SITE_NAME, SITE_URL, type SeoData } from "@/lib/seo";

function setMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setJsonLd(blocks: object[]) {
  document.head.querySelectorAll('script[data-seo="dynamic"]').forEach((el) => el.remove());
  for (const block of blocks) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "dynamic";
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

function applySeo(seo: SeoData, noindex: boolean) {
  document.title = seo.title;
  setMetaByName("description", seo.description);
  setMetaByName("robots", noindex ? "noindex, follow" : "index, follow");
  setCanonical(`${SITE_URL}${seo.path}`);

  setMetaByProperty("og:title", seo.title);
  setMetaByProperty("og:description", seo.description);
  setMetaByProperty("og:url", `${SITE_URL}${seo.path}`);

  setMetaByName("twitter:title", seo.title);
  setMetaByName("twitter:description", seo.description);

  setJsonLd(noindex ? [] : seo.jsonLd);
}

/** Applies the SEO metadata registered for `path` (see `src/lib/seo.ts`). Unregistered paths fall back to a noindex "not found" title/description. */
export function useSeo(path: string) {
  useEffect(() => {
    const seo = getSeoForPath(path);
    if (seo) {
      applySeo(seo, false);
      return;
    }
    applySeo(
      {
        title: `Page Not Found | ${SITE_NAME}`,
        description: "The page you're looking for doesn't exist.",
        path,
        jsonLd: [],
      },
      true,
    );
  }, [path]);
}
