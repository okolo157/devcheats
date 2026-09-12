import { commands, type Command } from "../data/commands";
import { workflows, type Workflow } from "../data/workflows";
import { agentSkills, type AgentSkill } from "../data/skills";
import { recipes, type Recipe } from "../data/recipes";
import { agentWorkflows, type AgentWorkflow } from "../data/agentWorkflows";
import {
  getCommandBySlug,
  getWorkflowBySlug,
  getSkillById,
  getRecipeById,
  getAgentWorkflowById,
  commandHref,
  workflowHref,
  skillHref,
  recipeHref,
  agentWorkflowHref,
} from "./detail-items";

export const SITE_URL = "https://devcheats.dev";
export const SITE_NAME = "DevCheats";

export interface SeoData {
  title: string;
  description: string;
  path: string;
  jsonLd: object[];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

const tabSeo: Record<string, SeoData> = {
  "/": {
    title: "DevCheats — The Ultimate Dev Command Reference",
    description: `A searchable cheatsheet of ${commands.length}+ Git, Terminal, npm, Docker, and AI commands plus ${workflows.length} workflows, ${agentSkills.length} agent skills, and ${recipes.length} recipes for developers.`,
    path: "/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
      itemListJsonLd([
        { name: "Commands", path: "/commands" },
        { name: "Workflows", path: "/workflows" },
        { name: "Agent Skills", path: "/skills" },
        { name: "Recipes", path: "/recipes" },
        { name: "AI Agent Workflows", path: "/agent-workflows" },
      ]),
    ],
  },
  "/commands": {
    title: `Dev Commands Cheatsheet | ${SITE_NAME}`,
    description: `Browse ${commands.length}+ Git, Docker, npm, and terminal commands with flags, examples, and copy-paste snippets.`,
    path: "/commands",
    jsonLd: [itemListJsonLd(commands.map((c) => ({ name: c.title, path: commandHref(c) })))],
  },
  "/workflows": {
    title: `Developer Workflows | ${SITE_NAME}`,
    description: `${workflows.length} multi-step workflows for common development tasks, from git rebasing to deployment.`,
    path: "/workflows",
    jsonLd: [itemListJsonLd(workflows.map((w) => ({ name: w.title, path: workflowHref(w) })))],
  },
  "/skills": {
    title: `AI Agent Skills | ${SITE_NAME}`,
    description: `${agentSkills.length} reusable AI agent skills for Claude, Cursor, and other coding agents.`,
    path: "/skills",
    jsonLd: [itemListJsonLd(agentSkills.map((s) => ({ name: s.name, path: skillHref(s) })))],
  },
  "/recipes": {
    title: `Dev Recipes | ${SITE_NAME}`,
    description: `${recipes.length} practical recipes and snippets for everyday development tasks.`,
    path: "/recipes",
    jsonLd: [itemListJsonLd(recipes.map((r) => ({ name: r.title, path: recipeHref(r) })))],
  },
  "/agent-workflows": {
    title: `AI Coding Agent Workflows | ${SITE_NAME}`,
    description: `${agentWorkflows.length} end-to-end workflows for AI coding agents like Claude Code and Cursor.`,
    path: "/agent-workflows",
    jsonLd: [itemListJsonLd(agentWorkflows.map((w) => ({ name: w.title, path: agentWorkflowHref(w) })))],
  },
};

function commandSeo(cmd: Command, path: string): SeoData {
  const description = cmd.description
    ? `${cmd.description} — \`${cmd.command}\``
    : `${cmd.title}: \`${cmd.command}\` — a DevCheats command reference.`;

  return {
    title: `${cmd.title} | ${SITE_NAME}`,
    description,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: cmd.title,
        description,
        text: cmd.command,
        programmingLanguage: "Shell",
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Commands", path: "/commands" },
        { name: cmd.title, path },
      ]),
    ],
  };
}

function workflowSeo(workflow: Workflow, path: string): SeoData {
  return {
    title: `${workflow.title} | ${SITE_NAME}`,
    description: workflow.description,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: workflow.title,
        description: workflow.description,
        step: workflow.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.label,
          text: step.command,
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Workflows", path: "/workflows" },
        { name: workflow.title, path },
      ]),
    ],
  };
}

function recipeSeo(recipe: Recipe, path: string): SeoData {
  return {
    title: `${recipe.title} | ${SITE_NAME}`,
    description: recipe.problem,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: recipe.title,
        description: recipe.problem,
        step: recipe.commands.map((entry, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: entry.label,
          text: entry.command,
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Recipes", path: "/recipes" },
        { name: recipe.title, path },
      ]),
    ],
  };
}

function agentWorkflowSeo(workflow: AgentWorkflow, path: string): SeoData {
  return {
    title: `${workflow.title} | ${SITE_NAME}`,
    description: workflow.goal,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: workflow.title,
        description: workflow.goal,
        step: workflow.agentInstructions.map((instruction, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text: instruction,
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "AI Agent Workflows", path: "/agent-workflows" },
        { name: workflow.title, path },
      ]),
    ],
  };
}

function skillSeo(skill: AgentSkill, path: string): SeoData {
  return {
    title: `${skill.name} | ${SITE_NAME}`,
    description: skill.description,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: skill.name,
        description: skill.description,
        keywords: skill.tags.join(", "),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Agent Skills", path: "/skills" },
        { name: skill.name, path },
      ]),
    ],
  };
}

export function getSeoForPath(pathname: string): SeoData | null {
  const tab = tabSeo[pathname];
  if (tab) return tab;

  let match = pathname.match(/^\/commands\/([^/]+)$/);
  if (match) {
    const item = getCommandBySlug(match[1]);
    return item ? commandSeo(item, pathname) : null;
  }

  match = pathname.match(/^\/workflows\/([^/]+)$/);
  if (match) {
    const item = getWorkflowBySlug(match[1]);
    return item ? workflowSeo(item, pathname) : null;
  }

  match = pathname.match(/^\/skills\/([^/]+)$/);
  if (match) {
    const item = getSkillById(match[1]);
    return item ? skillSeo(item, pathname) : null;
  }

  match = pathname.match(/^\/recipes\/([^/]+)$/);
  if (match) {
    const item = getRecipeById(match[1]);
    return item ? recipeSeo(item, pathname) : null;
  }

  match = pathname.match(/^\/agent-workflows\/([^/]+)$/);
  if (match) {
    const item = getAgentWorkflowById(match[1]);
    return item ? agentWorkflowSeo(item, pathname) : null;
  }

  return null;
}

function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function renderSeoHead(seo: SeoData): string {
  const url = `${SITE_URL}${seo.path}`;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const jsonLdScripts = seo.jsonLd
    .map((block) => `<script type="application/ld+json">${serializeJsonLd(block)}</script>`)
    .join("\n    ");

  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DevCheats — The Ultimate Dev Command Reference" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.png" />
    ${jsonLdScripts}`;
}
