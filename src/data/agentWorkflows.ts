import type { Category } from "./commands";

export interface AgentWorkflow {
  id: string;
  title: string;
  category: Category;
  goal: string;
  context: string[];
  agentInstructions: string[];
  verification: string[];
  expectedResult: string;
  compatibleTools: string[];
}

export const agentWorkflows: AgentWorkflow[] = [
  {
    id: "agent-context",
    title: "Give an agent repository context",
    category: "ai",
    goal: "Help an agent build an accurate mental model of the repository before edits.",
    context: [
      "Project purpose and constraints",
      "Runtime/toolchain and package manager",
      "Critical directories and ownership boundaries",
    ],
    agentInstructions: [
      "Summarize architecture and key modules before proposing changes.",
      "List entry points, tests, and validation commands.",
      "Call out assumptions and unknowns explicitly.",
    ],
    verification: [
      "Agent summary matches repo structure.",
      "Commands are runnable and accurate.",
      "No invented components or scripts.",
    ],
    expectedResult: "A concise repo map and a low-risk execution plan.",
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf", "Aider"],
  },
  {
    id: "agent-review-pr",
    title: "Ask an agent to review a PR",
    category: "ai",
    goal: "Get high-signal review feedback focused on correctness, risk, and tests.",
    context: [
      "PR summary and intended behavior",
      "Diff scope and affected services",
      "Known constraints and release pressure",
    ],
    agentInstructions: [
      "Understand change intent first, then inspect diff by area.",
      "Flag correctness bugs, regressions, and security concerns with evidence.",
      "Separate blocking issues from suggestions.",
      "List missing tests and compatibility risks.",
    ],
    verification: [
      "Each finding includes file and line references.",
      "Low-confidence speculation is excluded.",
      "Recommendations are actionable.",
    ],
    expectedResult: "Prioritized findings that improve merge confidence.",
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Cline"],
  },
  {
    id: "agent-debug-prod",
    title: "Ask an agent to debug a production issue",
    category: "ai",
    goal: "Drive a structured incident-debugging workflow without premature code edits.",
    context: [
      "Impact and failing endpoints",
      "Recent deploys and config changes",
      "Relevant logs, traces, and metrics",
    ],
    agentInstructions: [
      "Reproduce or simulate failure path first.",
      "State expected vs actual behavior and likely scope.",
      "Generate hypotheses and test them one at a time.",
      "Apply the smallest fix and add a regression test.",
    ],
    verification: [
      "Root cause is supported by evidence.",
      "Fix is validated with targeted checks.",
      "Regression test prevents recurrence.",
    ],
    expectedResult: "A verified root cause and low-risk fix.",
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf", "Cline"],
  },
  {
    id: "agent-upgrade-deps",
    title: "Ask an agent to upgrade dependencies",
    category: "devops",
    goal: "Upgrade dependencies safely with visibility into breaking risk.",
    context: [
      "Current dependency versions and lockfiles",
      "Target package(s) and urgency",
      "CI/test coverage and release windows",
    ],
    agentInstructions: [
      "Review release notes and breaking changes before editing.",
      "Upgrade incrementally when risk is high.",
      "Run lint, typecheck, tests, and build.",
      "Summarize lockfile deltas and API migration risk.",
    ],
    verification: [
      "Validation commands pass.",
      "No hidden transitive version surprises.",
      "Rollback path is documented.",
    ],
    expectedResult: "An auditable dependency upgrade with known risk profile.",
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Aider"],
  },
  {
    id: "agent-ci-failure",
    title: "Ask an agent to investigate CI failures",
    category: "devops",
    goal: "Triage failing CI quickly and converge on a reproducible local fix.",
    context: [
      "Failing job logs and commit SHA",
      "Workflow matrix and environment versions",
      "Recent merged changes and flaky test history",
    ],
    agentInstructions: [
      "Identify first failing step, not just final error.",
      "Reproduce failure locally with equivalent commands.",
      "Classify failure type: test, build, lint, infra, flaky.",
      "Propose minimal fix and confidence level.",
    ],
    verification: [
      "Fix reproduces locally and in CI rerun.",
      "No unrelated pipeline behavior changed.",
      "Follow-up actions are documented.",
    ],
    expectedResult: "A concrete CI fix or clear escalation path with evidence.",
    compatibleTools: ["GitHub Copilot", "Claude Code", "Cursor", "Windsurf"],
  },
];
