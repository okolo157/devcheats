import type { Category } from "./commands";

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  compatibleTools: string[];
  /** Suggested install path, e.g. .agents/skills/code-review/SKILL.md */
  filename: string;
  /** The full SKILL.md file content, ready to copy or download. */
  content: string;
  relatedSkills: string[];
  relatedCommands: string[];
  relatedWorkflows: string[];
}

const skill = (
  id: string,
  meta: Omit<AgentSkill, "id" | "filename" | "content">,
  body: string,
): AgentSkill => ({
  id,
  ...meta,
  filename: `.agents/skills/${id}/SKILL.md`,
  content: `---\nname: ${id}\ndescription: ${meta.description}\n---\n\n${body.trim()}\n`,
});

export const agentSkills: AgentSkill[] = [
  skill(
    "code-review",
    {
      name: "Code Review",
      description:
        "Review a pull request or diff like a senior engineer. Use when asked to review code changes, a PR, or a branch before merge.",
      category: "ai",
      tags: ["review", "pull-request", "correctness", "regression"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider", "Cline"],
      relatedSkills: ["security-review", "writing-tests"],
      relatedCommands: ["git diff main...HEAD", "git log -p", "git blame"],
      relatedWorkflows: ["Ask an agent to review a PR"],
    },
    `
# Code Review

Review the change for correctness first, style last. Never approve code you have not actually read.

## Inputs to gather

- The diff: \`git diff main...HEAD\` (or the PR diff the user pasted)
- Commit messages: \`git log --oneline main..HEAD\`
- The stated intent of the change — ask if it is not clear

## Review procedure

1. **Understand intent.** Restate in one sentence what the change is supposed to do. If the diff does not match the intent, that is the first finding.
2. **Read every changed file in full**, not just the hunks. Check how the changed code interacts with its surroundings.
3. **Hunt for real bugs:**
   - Broken edge cases: empty input, null/undefined, zero, boundary values
   - Async hazards: unhandled rejections, race conditions, missing await
   - Error handling: swallowed errors, wrong status codes, missing rollback
   - Logic inversions and off-by-one errors
   - State that can go stale or desync
4. **Check blast radius.** Search for other callers of changed functions (\`rg "functionName"\`). Flag changed public APIs and behavior changes that callers may rely on.
5. **Check tests.** Every behavior change should have a test. Name the exact missing cases.
6. **Security pass.** Injection, authz checks on new endpoints, secrets in code, unsafe deserialization. See the security-review skill for the full checklist.

## Output format

## Verdict
Approve / Request changes / Comment — with one sentence of rationale.

## Blocking issues
Each as: [file:line] problem → why it matters → suggested fix. Only real, evidence-backed issues.

## Suggestions (non-blocking)
Improvements the author may take or leave.

## Missing tests
Concrete test cases to add.

## Rules

- Every finding cites a file and line. No vague "this looks risky".
- Do not review style the linter already covers.
- Do not request changes for personal preference — label opinions as opinions.
- If the diff is too large to review well, say so and propose a split.
    `,
  ),
  skill(
    "systematic-debugging",
    {
      name: "Systematic Debugging",
      description:
        "Debug a reported bug or failing behavior methodically. Use when the user reports something broken, an error, or unexpected behavior and wants it fixed.",
      category: "ai",
      tags: ["debugging", "root-cause", "bisect", "regression"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Cline"],
      relatedSkills: ["writing-tests", "incident-response"],
      relatedCommands: ["git bisect start", "docker logs", "kubectl logs"],
      relatedWorkflows: ["Ask an agent to debug a production issue"],
    },
    `
# Systematic Debugging

Fix causes, not symptoms. Never edit code before you can reproduce the failure.

## Procedure

1. **Reproduce.** Get a reliable repro: exact steps, input, or failing test. If you cannot reproduce it, say so and gather what is missing (logs, environment, input data) instead of guessing.
2. **State the contract.** Write down expected vs actual behavior in one sentence each.
3. **Read the error fully.** Full stack trace, not the first line. The deepest frame in project code is usually closer to the cause than the top.
4. **Localize.** Narrow to the smallest unit that fails:
   - Add temporary logging or a debugger breakpoint at the suspected boundary
   - Comment out / stub downstream calls to isolate
   - For regressions: \`git bisect start && git bisect bad && git bisect good <sha>\`, then run the repro at each step
5. **Form one hypothesis at a time.** Write it down: "X is null because Y returns early when Z". Test it with the smallest possible experiment. If wrong, discard it fully before forming the next.
6. **Fix minimally.** The smallest change that removes the root cause. No drive-by refactors in the same commit.
7. **Add a regression test** that fails on the old code and passes on the new code. Name it after the bug.
8. **Verify broadly.** Run the repro, the new test, then the surrounding test suite.

## Anti-patterns to avoid

- Shotgun debugging: changing several things at once "to see if it helps"
- Catching and swallowing the error instead of fixing why it happens
- Fixing the repro case only (special-casing the reported input)
- Declaring victory without re-running the original repro

## Output

- Root cause (one paragraph, with evidence)
- The fix and why it is minimal
- The regression test added
- Anything still unexplained
    `,
  ),
  skill(
    "writing-tests",
    {
      name: "Writing Tests",
      description:
        "Write tests that match the repo's existing conventions. Use when asked to add, fix, or improve test coverage for a module, function, or bug.",
      category: "ai",
      tags: ["testing", "unit", "integration", "coverage"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf"],
      relatedSkills: ["systematic-debugging", "safe-refactoring"],
      relatedCommands: ["npm test", "vitest run", "pytest -q"],
      relatedWorkflows: ["Ask an agent to create tests"],
    },
    `
# Writing Tests

Tests must look like they were written by the team, not generated.

## Before writing anything

1. Find the existing tests: \`rg --files -g '*test*' -g '*spec*'\`
2. Read 2–3 of them. Note the framework, file naming, describe/it style, fixture factories, and assertion helpers in use.
3. Find how tests are run (package.json scripts, Makefile, CI config). Use exactly that command.
4. Never introduce a new framework, assertion library, or directory layout without asking.

## What to test

- **Behavior, not implementation.** Assert on inputs and outputs, not internal calls, unless the internal call IS the contract (e.g. "does not hit the database").
- **The branches that matter:** happy path, each error path, boundary values (empty, 0, max, off-by-one), invalid input.
- **Regression first:** if this work comes from a bug report, write the failing test that reproduces the bug before anything else.

## Writing rules

- One behavior per test; the test name states the expected behavior ("returns null when user is missing", not "test getUser").
- Arrange / Act / Assert, visibly separated.
- Deterministic: no real time, randomness, network, or wall-clock sleeps. Mock the boundary, inject the clock.
- Independent: tests pass in any order and in isolation (\`--runInBand\` or shuffle mode too).
- Mock sparingly. Prefer fakes/in-memory implementations over deep mock chains; if you mock everything you test nothing.
- Cover error messages and status codes, not just "it throws".

## Finishing

1. Run the new tests — watch them pass.
2. Mutate the source (break it on purpose) — watch the tests fail. Revert.
3. Run the full suite to check for interference.
4. Report: files added, cases covered, and any behavior you could not test and why.
    `,
  ),
  skill(
    "safe-refactoring",
    {
      name: "Safe Refactoring",
      description:
        "Restructure code without changing behavior. Use when asked to clean up, simplify, deduplicate, rename, or reorganize existing working code.",
      category: "ai",
      tags: ["refactor", "cleanup", "maintainability"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider"],
      relatedSkills: ["writing-tests", "code-review"],
      relatedCommands: ["git add -p", "npm test", "git diff --stat"],
      relatedWorkflows: ["Ask an agent to refactor safely"],
    },
    `
# Safe Refactoring

Refactoring changes structure, never behavior. If behavior must change too, that is a separate commit.

## Ground rules

1. **Tests before moves.** If the code you are touching has no tests, write characterization tests first (lock in current behavior, including quirks). Do not refactor untested code blind.
2. **One transformation at a time.** Extract function, rename, move module, inline — each as its own step with tests run in between. Never stack five rewrites into one edit.
3. **Preserve public APIs** unless the task explicitly says otherwise. Check all call sites with \`rg\` before changing a signature.
4. **No scope creep.** Do not fix unrelated formatting, upgrade dependencies, or rename adjacent things. Note them, mention them, leave them.

## Procedure

1. Run the relevant test suite — it must be green before you start.
2. State the target structure in 2–3 sentences so the user can stop you if it is wrong.
3. Apply one transformation.
4. Run tests. Red? Undo that step, understand why, redo smaller.
5. Repeat until done, then run the full suite plus lint/typecheck.
6. Review the final diff yourself: \`git diff\` should show movement and renaming, not logic edits.

## Common safe transformations

- Extract function/component from a long body (copy the code verbatim, pass in what it uses)
- Rename with editor-wide rename or \`rg -l old | xargs sed -i 's/old/new/g'\` followed by import checks
- Move a module and update every import in the same commit
- Replace a conditional with a lookup table or early returns — only when branches map 1:1

## Report

- What was restructured and why it is more maintainable
- Proof behavior is unchanged: tests green before/after, diff summary
- Deliberately untouched issues you noticed
    `,
  ),
  skill(
    "security-review",
    {
      name: "Security Review",
      description:
        "Audit code or a diff for exploitable security issues. Use when asked to check code for vulnerabilities, review auth, or assess security before shipping.",
      category: "security",
      tags: ["security", "owasp", "auth", "injection"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Cline"],
      relatedSkills: ["code-review", "dependency-upgrade"],
      relatedCommands: ["npm audit", "gitleaks detect", "pip-audit"],
      relatedWorkflows: ["Ask an agent to perform a security audit"],
    },
    `
# Security Review

Report only issues you can explain how to exploit. Severity without an attack path is noise.

## Checklist by area

**Injection**
- SQL: string-built queries anywhere? Require parameterized queries/ORM bindings.
- Shell: user input reaching \`exec\`, \`spawn\`, \`system()\`? Require arg arrays, never string interpolation.
- Template/HTML: unescaped output → XSS. Check dangerously-set-html equivalents.

**AuthN / AuthZ**
- Every new route/handler: who may call it, and where is that enforced? Client-side checks do not count.
- Object-level access: can user A fetch user B's resource by changing an ID? (IDOR)
- JWT/session: signature verified, expiry enforced, secret not hardcoded?

**Data exposure**
- Secrets in code, config, logs, or error messages — run \`gitleaks detect\` if available.
- API responses leaking fields the UI never shows (password hashes, internal IDs).
- Stack traces or debug endpoints reachable in production.

**Web classics**
- CSRF on state-changing GETs or cookie-auth POSTs without tokens.
- SSRF: user-controlled URLs fetched server-side — check allowlists.
- Path traversal: user input joined into file paths.
- Open redirects via unvalidated \`next\`/\`returnTo\` params.

**Dependencies & config**
- \`npm audit\` / \`pip-audit\` for known CVEs in actually-shipped deps.
- Insecure defaults: debug mode, permissive CORS (\`*\` with credentials), default credentials.

## Output format

For each finding:
- **Title + severity** (Critical/High/Medium/Low) **+ confidence** (Confirmed/Likely/Needs verification)
- **Location:** file:line
- **Attack path:** concrete steps an attacker would take
- **Fix:** specific remediation, not "sanitize input"
- **Verify:** how to confirm the fix works

End with a short list of areas checked and found clean, so silence is not ambiguous.
    `,
  ),
  skill(
    "dependency-upgrade",
    {
      name: "Dependency Upgrade",
      description:
        "Upgrade dependencies with breaking-change review and verification. Use when asked to update, bump, or migrate packages or framework versions.",
      category: "devops",
      tags: ["dependencies", "upgrade", "migration", "breaking-changes"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider"],
      relatedSkills: ["writing-tests", "security-review"],
      relatedCommands: ["npm outdated", "npm audit", "pnpm up"],
      relatedWorkflows: ["Ask an agent to upgrade dependencies"],
    },
    `
# Dependency Upgrade

An upgrade is not done when the version number changes — it is done when the app still works.

## Procedure

1. **Inventory.** \`npm outdated\` (or \`pnpm outdated\` / \`poetry show --outdated\`). Record current → target for each package.
2. **Read the release notes for every major bump.** Check CHANGELOG, GitHub releases, and migration guides. List breaking changes that could touch this codebase.
3. **Grep for the breaking APIs** before upgrading: \`rg "removedFunctionName"\`. If the code uses them, plan the codemod.
4. **Upgrade in stages:**
   - Patch/minor updates in one batch
   - Each major version in its own commit, riskiest package first
   - Never upgrade 10 majors at once
5. **After each stage, run the gates:** install, typecheck, lint, tests, build. All must pass before the next.
6. **Inspect the lockfile diff** (\`git diff package-lock.json | head -200\`): watch for unexpected transitive major bumps or duplicate versions of the same package.
7. **Check for deprecations** in the output of the test/build run — migrate them now while context is fresh.

## Migration edits

- Follow the official migration guide exactly; do not improvise new APIs.
- Search for every usage site; a missed call site compiles fine and breaks at runtime.
- For config format changes, migrate the config file and verify the tool actually starts.

## Report

- Table: package, old → new, risk level, breaking changes relevant to us
- Validation results (tests/build/lint)
- Residual risks and how to roll back (\`git revert\` of the stage commit, or pin to previous version)
    `,
  ),
  skill(
    "performance-profiling",
    {
      name: "Performance Profiling",
      description:
        "Find and fix performance bottlenecks with measurement. Use when the user reports slowness, high latency, memory growth, or asks to optimize.",
      category: "performance",
      tags: ["performance", "profiling", "latency", "memory"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Cline"],
      relatedSkills: ["systematic-debugging", "sql-optimization"],
      relatedCommands: ["curl -w", "node --inspect", "time"],
      relatedWorkflows: ["Ask an agent to investigate a performance issue"],
    },
    `
# Performance Profiling

Measure first. Optimizing without a profile is guessing, and the guess is usually wrong.

## Establish the baseline

1. Define the metric that matters: p95 latency, time-to-interactive, memory ceiling, query time.
2. Measure it before touching anything:
   - HTTP: \`curl -o /dev/null -s -w 'total: %{time_total}s\\n' <url>\`
   - Script: \`time <command>\`
   - Node: \`node --cpu-prof app.js\` or \`node --inspect\` + Chrome DevTools
   - Frontend: Lighthouse / performance panel trace
3. Record the number. Every later claim is relative to it.

## Find the bottleneck

- **Backend:** which layer — DB, network calls, CPU, serialization? Add timing around each; check slow query logs; look for N+1 (a query inside a loop).
- **Frontend:** long tasks, re-render storms (React DevTools profiler), bundle size (\`npx vite-bundle-visualizer\` or webpack analyzer), unmemoized expensive computation.
- **Memory:** growth over time = leak. Heap snapshots before/after the suspected action.

## Optimize

1. Fix the single largest contributor first. A 50% win on the top item beats 5% on ten items.
2. Prefer algorithmic fixes (caching, indexing, batching, pagination) over micro-tweaks.
3. State the tradeoff of each change: memory vs latency, freshness vs cache hits, complexity vs speed.

## Verify

- Re-run the exact baseline measurement. Report before → after with the same method and load.
- Confirm correctness: run the test suite — fast and wrong is worse than slow.
- If you cannot measure an improvement, revert the change.
    `,
  ),
  skill(
    "accessibility-audit",
    {
      name: "Accessibility Audit",
      description:
        "Audit a web UI for accessibility problems and fix them. Use when asked to check or improve a11y, keyboard support, screen reader behavior, or WCAG compliance.",
      category: "frontend",
      tags: ["a11y", "wcag", "aria", "keyboard"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf"],
      relatedSkills: ["code-review", "writing-tests"],
      relatedCommands: ["npx axe", "npm run lint", "npx lighthouse"],
      relatedWorkflows: ["Ask an agent to audit frontend accessibility"],
    },
    `
# Accessibility Audit

Test like a user who cannot use a mouse or see the screen.

## Manual checks (do these, automated tools miss most issues)

1. **Keyboard only.** Unplug the mouse mentally: Tab through the page. Can you reach every interactive element? Can you see where focus is? Can you escape modals with Esc and does focus return to the trigger? Is tab order logical?
2. **Semantic structure.** One \`<h1>\`, headings in order, landmarks (\`main\`, \`nav\`, \`header\`). Buttons are \`<button>\`, links are \`<a>\` — not clickable divs.
3. **Forms.** Every input has a visible \`<label>\` (not placeholder-only). Errors are announced and tied to fields with \`aria-describedby\`.
4. **Images.** Informative images have alt text; decorative ones have \`alt=""\`. Never alt="image.png".
5. **Contrast.** Text ≥ 4.5:1 (large text ≥ 3:1) against its background — check muted/secondary text especially.
6. **Motion.** Animations respect \`prefers-reduced-motion\`.
7. **Dynamic content.** Toasts, validation messages, and route changes are announced (aria-live / focus management).

## Automated pass

- \`npx axe <url>\` or the axe DevTools extension — fix every violation it finds, then do the manual pass anyway.
- \`npx lighthouse <url> --only-categories=accessibility\`

## Fixing rules

- Prefer native HTML over ARIA. A \`<button>\` beats \`<div role="button" tabindex="0">\` every time.
- Never use positive \`tabindex\` values.
- Do not hide focus outlines without a visible replacement.

## Output

Per issue: what is broken → who it blocks and how → the fix (with the element/code change) → how to verify. Group by severity: blockers (task impossible), major (task painful), minor (polish).
    `,
  ),
  skill(
    "writing-documentation",
    {
      name: "Writing Documentation",
      description:
        "Write docs grounded in the actual codebase. Use when asked to write or update a README, setup guide, architecture docs, or onboarding docs.",
      category: "ai",
      tags: ["docs", "readme", "onboarding", "architecture"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf"],
      relatedSkills: ["code-review", "systematic-debugging"],
      relatedCommands: ["cat package.json", "rg --files", "docker compose config"],
      relatedWorkflows: ["Ask an agent to document a codebase"],
    },
    `
# Writing Documentation

Document what exists, not what should exist. Every command in the docs must be one you verified.

## Grounding pass (mandatory)

1. Read \`package.json\` / \`pyproject.toml\` / \`go.mod\` — real scripts, real entry points, real versions.
2. \`rg --files\` for config: Dockerfile, compose files, .env.example, CI config. These are your setup instructions.
3. Read the entry point and one layer down to sketch the architecture.
4. List environment variables actually referenced in code: \`rg "process.env\\.|os.environ"\`.

## README structure (in this order)

1. One-paragraph what/why
2. Prerequisites (versions from the real toolchain files)
3. Setup: exact commands, copied from package scripts / compose files, in order
4. Run: dev command, then how to run tests and lint
5. Project layout: a short tree with one line per important directory
6. Environment variables table: name, purpose, required/optional
7. Deployment: only what the CI/config files prove, otherwise omit
8. Troubleshooting: only real failure modes you can point to (port conflicts, missing env, migration steps)

## Rules

- Never invent features, flags, or endpoints. If unsure whether something exists, search for it or omit it.
- Every shell command must be runnable as written — no \`<your-key>\` placeholders without explaining where to get the value.
- Mark unverifiable assumptions explicitly: "TODO: confirm staging deploy process with team."
- Keep it short. Delete any sentence that does not help someone run or change the project.
- Match the repo's existing tone and heading style if docs already exist.
    `,
  ),
  skill(
    "git-conflict-resolution",
    {
      name: "Git Conflict Resolution",
      description:
        "Resolve merge and rebase conflicts deliberately. Use when a merge, rebase, cherry-pick, or pull stops with conflicts and the user wants them resolved safely.",
      category: "ai",
      tags: ["git", "merge", "rebase", "conflicts"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider"],
      relatedSkills: ["safe-refactoring", "writing-tests"],
      relatedCommands: ["git status", "git diff --name-only --diff-filter=U", "git rebase --abort"],
      relatedWorkflows: ["Resolve git merge conflicts"],
    },
    `
# Git Conflict Resolution

A conflict is two intentions colliding. Resolve by understanding both, not by picking a side at random.

## Triage

1. \`git status\` — are we merging or rebasing? Which files conflict?
2. \`git diff --name-only --diff-filter=U\` for the conflict list.
3. For each file, read both versions of the conflicted region. Understand what each side was trying to accomplish before editing. Check the commits on each side: \`git log --oneline main..HEAD\` and the incoming branch.
4. Escape hatches exist — tell the user they can bail: \`git merge --abort\` / \`git rebase --abort\`.

## Resolving

- **Same area, different logic:** hand-merge. Keep both behaviors; the resolution is usually a synthesis, not a choice.
- **Both added similar code:** deduplicate into one version, keep the better name/structure.
- **One side moved/renamed, other side edited:** apply the edits to the moved location.
- **Lockfiles / generated files:** never hand-merge. Take either side, then regenerate: \`npm install\`, \`pnpm install\`, or the project's generator. Verify the lockfile parses.
- **When genuinely ambiguous:** stop and ask the user which behavior is correct. A wrong silent merge is worse than a question.

## After resolving each file

\`git add <file>\`, then continue: \`git merge --continue\` / \`git rebase --continue\`.

## Verify (mandatory)

1. Build and run the test suite — conflict resolution breaks code silently.
2. \`git diff main...HEAD --stat\` (or the merge result) — sanity-check the final change matches both intents.
3. During rebase: watch for the same conflict recurring on later commits; resolve consistently.
    `,
  ),
  skill(
    "incident-response",
    {
      name: "Incident Response",
      description:
        "Triage a production incident without making things worse. Use when production is down, errors are spiking, or users report an outage and the user needs structured help.",
      category: "devops",
      tags: ["incident", "production", "outage", "triage"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf", "Cline"],
      relatedSkills: ["systematic-debugging", "sql-optimization"],
      relatedCommands: ["kubectl get pods", "docker logs", "git log --since"],
      relatedWorkflows: ["Ask an agent to debug a production issue"],
    },
    `
# Incident Response

Restore service first, understand second, perfect never. No code edits during triage.

## Phase 1 — Assess (minutes)

1. What is the user impact: who, what %, since when? Which endpoints/features?
2. Check the obvious in parallel:
   - Recent deploys or config changes: \`git log --since="24 hours ago" --oneline\`, CI deploy history
   - Infra health: \`kubectl get pods\`, \`docker ps\`, dashboard status pages of critical dependencies
   - Error rate and type in logs/metrics: 5xx spike? Timeouts? One error message dominating?
3. Classify: deploy regression / dependency down / resource exhaustion / data issue / traffic spike.

## Phase 2 — Mitigate

Prefer reversible actions, cheapest first:
- **Rollback** the suspect deploy — this fixes most deploy regressions in minutes.
- **Restart/scale** if resource exhaustion (OOM kills, connection pool full).
- **Feature-flag off** the suspect change if flags exist.
- Confirm mitigation worked by watching the error rate, not by hoping.

## Phase 3 — Diagnose (service restored or stable)

1. Reproduce in staging or against the reverted version.
2. Follow the systematic-debugging skill: hypotheses, one experiment at a time.
3. Identify the root cause with evidence from logs/traces, not plausibility.

## Phase 4 — Follow-through

- Permanent fix with a regression test.
- Timeline: detected → mitigated → root-caused → fixed, with timestamps.
- Action items: what monitoring/alert/test would have caught this sooner?

## Never during an incident

- Deploy an untested "quick fix" to production under pressure
- Make multiple simultaneous changes (you will not know which helped)
- Delete logs or restart evidence away before capturing it
    `,
  ),
  skill(
    "api-design-review",
    {
      name: "API Design Review",
      description:
        "Review an API design or implementation for consistency and usability. Use when asked to design, review, or critique REST/GraphQL endpoints, contracts, or payloads.",
      category: "ai",
      tags: ["api", "rest", "graphql", "contracts"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider"],
      relatedSkills: ["code-review", "writing-documentation"],
      relatedCommands: ["curl -i", "httpie", "rg app.(get|post|put|delete)"],
      relatedWorkflows: ["Ask an agent to review a PR"],
    },
    `
# API Design Review

An API is a promise that is expensive to break. Review for the consumer, not the implementer.

## Review checklist

**Resource modeling**
- Endpoints are nouns, not verbs: \`GET /users/42/orders\`, not \`/getOrdersForUser\`.
- Hierarchy reflects real ownership; avoid nesting deeper than 2 levels.
- Collection vs item is unambiguous and pluralization is consistent.

**Methods & status codes**
- GET is safe and idempotent; PUT/PATCH/DELETE are idempotent; POST is not.
- Status codes mean what they say: 201 on create (with the created resource or Location), 204 on empty success, 400 for client input errors, 401 unauthenticated vs 403 unauthorized, 404 unknown resource, 409 conflict, 422 semantic validation failure, 429 rate limited.
- Never 200-with-error-in-body.

**Consistency with the existing API**
- Read neighboring endpoints first. Match their naming (snake_case vs camelCase), envelope shape, pagination style (cursor vs offset), filtering and sorting conventions, and error format. Consistency beats personal taste.
- Error responses share one shape everywhere: e.g. \`{ "error": { "code": "...", "message": "...", "details": ... } }\`.

**Compatibility & evolution**
- Is this change breaking? Removed/renamed fields, changed types, tightened validation, changed defaults all break clients. Require versioning or additive-only changes.
- New required fields on existing requests = breaking.
- Pagination on every unbounded list endpoint — no \`SELECT *\` APIs.

**Details that bite**
- Time is ISO 8601 UTC; money is integer minor units or decimal string, never float.
- IDs are opaque strings; never expose sequential integers if enumeration matters.
- AuthZ is enforced server-side on every endpoint, including "internal" ones.

## Output

Findings grouped as: Breaking risks / Inconsistencies with existing API / Usability issues / Suggestions — each with the endpoint, the problem, and a concrete proposed shape.
    `,
  ),
  skill(
    "sql-optimization",
    {
      name: "SQL Optimization",
      description:
        "Diagnose and fix slow database queries. Use when a query, endpoint, or page is slow and the database is the suspected bottleneck.",
      category: "performance",
      tags: ["sql", "postgres", "indexes", "n+1"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Cline"],
      relatedSkills: ["performance-profiling", "systematic-debugging"],
      relatedCommands: ["EXPLAIN ANALYZE", "pg_stat_statements", "\\d table"],
      relatedWorkflows: ["Optimize slow SQL queries"],
    },
    `
# SQL Optimization

Let the query planner tell you the truth: EXPLAIN ANALYZE before and after, always.

## Diagnose

1. Get the real query with real parameters (from logs, pg_stat_statements, or the ORM's query log). ORM-generated SQL must be read as SQL, not guessed from the ORM code.
2. Run \`EXPLAIN (ANALYZE, BUFFERS)\` on it against production-like data volume. A query that is fast on 100 rows can be catastrophic on 10M.
3. Read the plan for the classic red flags:
   - Sequential scan on a large table where you filter a small subset
   - Rows estimated vs actual off by orders of magnitude (stale stats → ANALYZE the table)
   - Nested loop over huge row counts; sorts spilling to disk
4. Check for N+1 at the application layer: one query per item in a list. Fix with a JOIN, an IN query, or the ORM's eager-loading — and verify the query count dropped.

## Fix patterns

- **Missing index:** add an index matching the WHERE/JOIN/ORDER BY columns. Composite index column order: equality columns first, then range, then sort. Verify the plan actually uses it (an unused index only slows writes).
- **Selecting everything:** select only needed columns; avoid functions on indexed columns in WHERE (\`WHERE lower(email) = ...\` needs a functional index).
- **Pagination:** replace OFFSET on large sets with keyset/cursor pagination (\`WHERE id > :last ORDER BY id LIMIT n\`).
- **Count(*)** on huge tables for UI badges: use estimates or a counter table.

## Verify

- Re-run EXPLAIN ANALYZE: report before → after execution time with the same data.
- Confirm writes are not harmed: note any new index's write cost.
- Migrations: add indexes concurrently on live systems (\`CREATE INDEX CONCURRENTLY\` in Postgres, outside a transaction).
    `,
  ),
  skill(
    "docker-troubleshooting",
    {
      name: "Docker Troubleshooting",
      description:
        "Diagnose failing Docker builds and misbehaving containers. Use when a build fails, a container exits, or compose services will not start or reach each other.",
      category: "docker",
      tags: ["docker", "compose", "containers", "buildkit"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf"],
      relatedSkills: ["systematic-debugging", "incident-response"],
      relatedCommands: ["docker logs", "docker inspect", "docker compose ps"],
      relatedWorkflows: ["Debug a failing Docker build"],
    },
    `
# Docker Troubleshooting

Containers fail for boring reasons. Check them in order before touching the Dockerfile.

## Container will not start / exits immediately

1. \`docker ps -a\` → get the exit code. 0 = the process finished (missing long-running command), 1 = app error, 127 = command not found, 137 = OOM-killed, 139 = segfault.
2. \`docker logs <container>\` — the last lines usually name the problem.
3. Entrypoint/CMD issues: \`docker inspect <container> --format '{{json .Config}}'\`. Shell-form vs exec-form, missing interpreter, CRLF line endings in scripts (fix with \`sed -i 's/\\r$//'\` or .gitattributes).
4. Get inside: \`docker run --rm -it --entrypoint sh <image>\` and poke around.

## Build failures

1. Read the failing step's full output — BuildKit truncates; rerun with \`--progress=plain\`.
2. Cache confusion: rebuild the suspicious stage with \`--no-cache\` before assuming the Dockerfile is wrong.
3. .dockerignore missing → giant context, or worse, files copied that should not be (node_modules, .env).
4. Network flakes during package install: retry; do not bake in workarounds for a transient failure.

## Compose networking

- Services reach each other by service name on the compose network, not localhost. \`localhost\` inside a container is the container itself.
- \`depends_on\` waits for start, not readiness — a DB that takes 10s to accept connections needs a healthcheck + \`condition: service_healthy\`.
- Port conflicts: \`docker compose ps\` and check the host port mapping; another project may hold 5432.
- Verify from inside: \`docker compose exec app sh\` then \`wget -qO- http://db:5432\` or equivalent.

## Image hygiene (when relevant)

- Multi-stage builds to keep runtime images small.
- Pin base image versions (\`node:20-alpine\`, not \`node:latest\`).
- Never store secrets via ENV or COPY — they persist in layers. Use build secrets or runtime env.

## Output

Root cause, the minimal fix, and the command that proves the fix (\`docker compose up\` healthy, endpoint reachable).
    `,
  ),
  skill(
    "pr-description-writer",
    {
      name: "PR Description Writer",
      description:
        "Write a clear pull request title and description from the actual diff. Use when asked to summarize changes, prepare a PR, or write commit/merge descriptions.",
      category: "ai",
      tags: ["git", "pr", "communication", "review"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider", "Cline"],
      relatedSkills: ["code-review", "writing-documentation"],
      relatedCommands: ["git diff main...HEAD", "git log --oneline main..HEAD"],
      relatedWorkflows: ["Ask an agent to review a PR"],
    },
    `
# PR Description Writer

Write for the reviewer who has zero context and five minutes.

## Gather the facts

1. \`git log --oneline main..HEAD\` — the commits.
2. \`git diff main...HEAD --stat\` — the shape of the change.
3. \`git diff main...HEAD\` — read it. The description must match the diff, not the commit messages (which are often wrong).

## Format

**Title:** imperative, ≤ 72 chars, states the change: "Add retry backoff to payment webhook handler". Not "fixes" or "updates".

**Body:**

## What
One to three sentences: what changed and why. The "why" is the part reviewers cannot get from the diff — lead with it if it is non-obvious.

## How
Only if the approach is non-obvious: key design decisions, alternatives rejected, and why. Skip for straightforward changes.

## Testing
How the reviewer can verify: tests added, commands run, manual steps. "Ran npm test" is fine; "tested locally" alone is not.

## Notes / risks
Anything the reviewer should scrutinize: behavior changes, migrations, feature flags, follow-ups deliberately out of scope.

## Rules

- Never claim tests were added or run unless the diff and your knowledge confirm it.
- If the change has UI impact, say what screenshot/recording should be attached (and ask the user to add it).
- One PR = one concern. If the diff mixes two unrelated changes, say so and suggest splitting instead of writing a cover story.
- Keep the whole thing under ~40 lines. Reviewers skim.
    `,
  ),
  skill(
    "commit-message-writer",
    {
      name: "Commit Message Writer",
      description:
        "Write conventional, informative commit messages from staged changes. Use when asked to commit work, write a commit message, or clean up commit history.",
      category: "ai",
      tags: ["git", "commits", "conventional-commits"],
      compatibleTools: ["Claude Code", "GitHub Copilot", "Cursor", "Aider"],
      relatedSkills: ["pr-description-writer", "safe-refactoring"],
      relatedCommands: ["git status", "git diff --staged", "git log --oneline"],
      relatedWorkflows: ["Clean up commit history"],
    },
    `
# Commit Message Writer

A commit message explains WHY the change exists to someone reading git blame in two years.

## Gather the facts

1. \`git status\` and \`git diff --staged\` (or \`git diff\` if unstaged) — read the actual change.
2. \`git log --oneline -10\` — match the repo's existing message style. If the repo uses conventional commits, use them; if not, do not impose them.

## Format

**Subject line:**
- Imperative mood: "Add rate limiting to login endpoint" — completes "If applied, this commit will ___".
- ≤ 72 characters, no trailing period.
- Conventional commits (only if the repo uses them): \`type(scope): subject\` with type ∈ feat, fix, refactor, perf, test, docs, chore, build, ci.

**Body (when the subject is not enough):**
- Wrapped at 72 chars, blank line after subject.
- WHAT changed and WHY — the motivation, the bug's cause, the reason for the chosen approach.
- Not a restatement of the diff; the diff already shows what changed mechanically.

## Splitting commits

If the staged change does two unrelated things, say so and propose a split with \`git add -p\` hunks rather than writing a muddled "and also" message. A message that needs "and" twice is two commits.

## Breaking changes

If the change breaks compatibility, flag it: \`feat(api)!: ...\` or a \`BREAKING CHANGE:\` footer explaining what consumers must do.

## Never

- "fix", "wip", "changes", "asdf" style subjects
- Describe code line-by-line ("changed line 3 to use map")
- Claim behavior not present in the diff
    `,
  ),
];
