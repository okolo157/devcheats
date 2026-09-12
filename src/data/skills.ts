import type { Category } from "./commands";

export interface SkillFormat {
  id: "markdown" | "skill" | "agents" | "copilot" | "cursor";
  label: string;
  content: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  compatibleTools: string[];
  formats: SkillFormat[];
  relatedSkills: string[];
  relatedCommands: string[];
  relatedWorkflows: string[];
}

const wrapSkill = (title: string, body: string): SkillFormat[] => [
  { id: "markdown", label: "Markdown", content: `# ${title}\n\n${body}` },
  { id: "skill", label: "SKILL.md", content: `# SKILL: ${title}\n\n## Objective\n${body}` },
  { id: "agents", label: "AGENTS.md", content: `## Skill: ${title}\n\n${body}` },
  { id: "copilot", label: "Copilot", content: `Use this instruction set when you execute ${title.toLowerCase()} tasks.\n\n${body}` },
  { id: "cursor", label: "Cursor", content: `rule \"${title}\" {\n  when: \"task matches ${title.toLowerCase()}\"\n  instruction: \"${body.replace(/\n/g, " ")}\"\n}` },
];

export const agentSkills: AgentSkill[] = [
  {
    id: "code-review",
    name: "Code Review Skill",
    description: "Review code like a senior engineer and separate blockers from suggestions.",
    category: "ai",
    tags: ["review", "correctness", "regression", "security"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Aider", "Cline"],
    formats: wrapSkill(
      "Code Review Skill",
      `Purpose: review behavior, correctness, and risk before style.\n\nWorkflow:\n1. Understand the full change and intent before judging details.\n2. Identify bugs, regressions, and edge cases with evidence.\n3. Check error handling and failure paths.\n4. Check security implications and data exposure.\n5. Check performance impacts.\n6. Check tests and identify missing coverage.\n7. Validate API and backward compatibility.\n8. Classify findings into blocking issues vs suggestions.\n9. Provide concrete file and line references where possible.\n\nOutput format:\n- Summary\n- Blocking issues\n- Suggestions\n- Test gaps\n- Risk notes`
    ),
    relatedSkills: ["security-audit", "test-generator"],
    relatedCommands: ["git diff", "git blame", "npm test"],
    relatedWorkflows: ["Ask an agent to review a PR"],
  },
  {
    id: "test-generator",
    name: "Test Generator Skill",
    description: "Generate meaningful tests that match existing test style and tooling.",
    category: "ai",
    tags: ["testing", "unit", "integration", "regression"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf"],
    formats: wrapSkill(
      "Test Generator Skill",
      `Purpose: create useful tests without introducing random frameworks.\n\nWorkflow:\n1. Inspect existing test structure, naming, fixtures, and utilities first.\n2. Follow established framework and conventions.\n3. Add unit tests for focused logic branches.\n4. Add integration tests for multi-component behavior.\n5. Cover edge, error, and boundary cases.\n6. Add regression tests for reported failures.\n7. Use mocks only when isolation is necessary.\n8. Keep tests deterministic and isolated from global state.\n9. Explain why each new test matters.`
    ),
    relatedSkills: ["debugging", "refactoring"],
    relatedCommands: ["npm test", "pnpm test", "pytest -q"],
    relatedWorkflows: ["Ask an agent to create tests"],
  },
  {
    id: "debugging",
    name: "Debugging Skill",
    description: "Debug systematically before changing code.",
    category: "ai",
    tags: ["debugging", "root-cause", "regression"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Cline"],
    formats: wrapSkill(
      "Debugging Skill",
      `Workflow:\n1. Reproduce the problem reliably.\n2. State expected behavior.\n3. Capture actual behavior and error output.\n4. Inspect logs and traces.\n5. Narrow to the failing component.\n6. Form explicit hypotheses.\n7. Test hypotheses with minimal experiments.\n8. Make the smallest appropriate fix.\n9. Add a regression test.\n10. Verify the fix with targeted and related checks.`
    ),
    relatedSkills: ["test-generator", "performance-audit"],
    relatedCommands: ["docker logs", "kubectl logs", "git bisect"],
    relatedWorkflows: ["Ask an agent to debug a production issue"],
  },
  {
    id: "refactoring",
    name: "Refactoring Skill",
    description: "Refactor production code safely with small reversible changes.",
    category: "ai",
    tags: ["refactor", "safety", "maintainability"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Aider"],
    formats: wrapSkill(
      "Refactoring Skill",
      `Workflow:\n1. Understand current behavior and test coverage.\n2. Do not change behavior unless requested.\n3. Make incremental changes in small commits.\n4. Preserve public APIs by default.\n5. Avoid unrelated cleanup in the same change.\n6. Run relevant tests after each meaningful step.\n7. Explain tradeoffs and rollback strategy.\n8. Prefer reversible transformations.`
    ),
    relatedSkills: ["code-review", "dependency-upgrade"],
    relatedCommands: ["git add -p", "git rebase -i", "npm test"],
    relatedWorkflows: ["Ask an agent to refactor safely"],
  },
  {
    id: "security-audit",
    name: "Security Audit Skill",
    description: "Audit code for concrete security issues with evidence.",
    category: "security",
    tags: ["security", "auth", "input-validation", "secrets"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Cline"],
    formats: wrapSkill(
      "Security Audit Skill",
      `Checklist:\n- Authentication and authorization correctness\n- Input validation and sanitization\n- Injection vectors (SQL, command, template)\n- Secret handling and sensitive logging\n- SSRF, XSS, CSRF, path traversal\n- Unsafe deserialization and insecure defaults\n- Dependency vulnerabilities and outdated packages\n- Access control and privilege boundaries\n\nRules:\n1. Do not claim vulnerabilities without evidence.\n2. Include exploit path or failing scenario.\n3. Mark severity and confidence.\n4. Recommend concrete remediation and verification.`
    ),
    relatedSkills: ["code-review", "dependency-upgrade"],
    relatedCommands: ["npm audit", "pip-audit", "gitleaks detect"],
    relatedWorkflows: ["Ask an agent to perform a security audit"],
  },
  {
    id: "documentation",
    name: "Documentation Skill",
    description: "Generate codebase-grounded docs without inventing behavior.",
    category: "ai",
    tags: ["docs", "readme", "architecture", "onboarding"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf"],
    formats: wrapSkill(
      "Documentation Skill",
      `Workflow:\n1. Inspect the repository before writing docs.\n2. Prioritize README, setup, and local development.\n3. Document architecture and module boundaries.\n4. Document APIs and environment variables that actually exist.\n5. Add troubleshooting and deployment steps from real scripts/config.\n6. Clearly mark assumptions and TODO gaps.\n7. Avoid documenting features not present in code.`
    ),
    relatedSkills: ["code-review", "debugging"],
    relatedCommands: ["cat README.md", "npm run", "docker compose up"],
    relatedWorkflows: ["Ask an agent to document a codebase"],
  },
  {
    id: "dependency-upgrade",
    name: "Dependency Upgrade Skill",
    description: "Upgrade dependencies safely with risk review and verification.",
    category: "devops",
    tags: ["dependencies", "upgrade", "risk", "compatibility"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Aider"],
    formats: wrapSkill(
      "Dependency Upgrade Skill",
      `Workflow:\n1. Identify current versions and lockfile state.\n2. Review changelogs/release notes when available.\n3. Check breaking changes and migration guides.\n4. Upgrade incrementally when risk is high.\n5. Run tests, lint, and type checks.\n6. Inspect lockfile and transitive changes.\n7. Check for deprecated API usage.\n8. Summarize residual risks and rollback plan.`
    ),
    relatedSkills: ["security-audit", "test-generator"],
    relatedCommands: ["npm outdated", "pnpm up", "poetry update"],
    relatedWorkflows: ["Ask an agent to upgrade dependencies"],
  },
  {
    id: "performance-audit",
    name: "Performance Audit Skill",
    description: "Find and verify real performance bottlenecks with evidence.",
    category: "performance",
    tags: ["performance", "profiling", "latency", "optimization"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Cline"],
    formats: wrapSkill(
      "Performance Audit Skill",
      `Checklist:\n- Database queries and N+1 patterns\n- Network calls and payload size\n- Bundle size and startup time\n- Rendering and re-render churn\n- Caching effectiveness\n- CPU-heavy loops and memory pressure\n\nRules:\n1. Measure before and after when possible.\n2. Provide evidence for each claim.\n3. Prioritize high-impact changes first.\n4. Note tradeoffs (memory vs latency, complexity vs speed).`
    ),
    relatedSkills: ["debugging", "refactoring"],
    relatedCommands: ["time", "curl -w", "node --inspect"],
    relatedWorkflows: ["Ask an agent to investigate a performance issue"],
  },
  {
    id: "accessibility-audit",
    name: "Accessibility Audit Skill",
    description: "Audit frontend accessibility and provide actionable fixes.",
    category: "frontend",
    tags: ["a11y", "frontend", "aria", "keyboard"],
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf"],
    formats: wrapSkill(
      "Accessibility Audit Skill",
      `Checklist:\n- Semantic HTML and heading structure\n- Keyboard navigation and focus order\n- Focus visibility and trap behavior\n- ARIA usage and correctness\n- Form labels, errors, and helper text\n- Color contrast and motion preferences\n- Screen-reader announcements\n- Image alt text and decorative handling\n\nRules:\n1. Report issue + user impact + fix recommendation.\n2. Prefer standards-based fixes over ARIA patches.\n3. Verify with keyboard and assistive technology checks.`
    ),
    relatedSkills: ["code-review", "documentation"],
    relatedCommands: ["npm run test:a11y", "npx axe", "pnpm lint"],
    relatedWorkflows: ["Ask an agent to audit frontend accessibility"],
  },
];
