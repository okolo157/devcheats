# Rework Agent Skills into real, copy-paste-ready SKILL.md files

## Problem
The current "Agent Skills" section holds 9 generic instruction lists (Code Review, Debugging, etc.) rendered through five pseudo-format tabs (Markdown / SKILL.md / AGENTS.md / Copilot / Cursor). The "Cursor" and "Copilot" outputs are invented syntax that wouldn't actually work, and the content is vague advice rather than a usable file.

## What we'll build

### 1. Rewrite the skill content (`src/data/skills.ts`)
- Replace the 9 generic skills with a solid set of real skills written as proper `SKILL.md` files — the format used by Claude Code / Claude agent skills:
  - Valid YAML frontmatter (`name`, `description` with a real trigger condition)
  - Concrete, opinionated workflows with actual commands, file paths, and tool names
  - No filler — each skill must be something you could drop into `.agents/skills/<name>/SKILL.md` and use as-is
- Target skill set (12–15, mix of existing topics reworked + new):
  - `code-review` — structured PR review with severity levels and evidence rules
  - `systematic-debugging` — reproduce → hypothesize → bisect → regression test
  - `writing-tests` — match repo conventions, unit/integration/regression patterns
  - `safe-refactoring` — incremental, reversible, behavior-preserving changes
  - `security-review` — OWASP-style checklist with severity + confidence ratings
  - `dependency-upgrade` — changelog review, incremental bumps, rollback plan
  - `performance-profiling` — measure-first optimization with before/after evidence
  - `accessibility-audit` — keyboard, ARIA, contrast checks with concrete fixes
  - `writing-documentation` — codebase-grounded README/docs generation
  - `git-conflict-resolution` — rebase/merge conflict triage workflow
  - `incident-response` — production issue triage without premature edits
  - `api-design-review` — REST/GraphQL contract review checklist
  - Plus a few more if quality stays high (e.g. `sql-optimization`, `docker-troubleshooting`, `pr-description-writer`)

### 2. Simplify the data model
- Drop the `formats` array and `wrapSkill` generator — each skill holds one canonical `content` string (the full SKILL.md text).
- Keep `id`, `name`, `description`, `category`, `tags`, `compatibleTools`, and the `related*` fields.
- Add a `filename` hint (e.g. `.agents/skills/code-review/SKILL.md`) shown on the card so users know where to put it.

### 3. Simplify the UI
- **SkillCard.tsx**: remove the format Tabs entirely; show the full SKILL.md in one monospace block, with the existing Copy (with toast-style feedback) and Download buttons. Download now always saves `<skill-id>.SKILL.md`.
- **SkillDetail.tsx**: same treatment — single content block, copy + download, plus a short "where to put this file" note.
- No routing, search, or filter changes needed — skills stay searchable and category-filtered as today.

### 4. Verify
- Build passes, skills grid and `/skills/:id` pages render, copy and download work.

## Technical notes
- Files touched: `src/data/skills.ts`, `src/components/SkillCard.tsx`, `src/pages/SkillDetail.tsx`.
- The `SkillFormat` interface and `wrapSkill` helper are deleted; check no other file imports them (only the two UI files use `formats`).
- Content written once in the data file as template literals — no generated variants.
