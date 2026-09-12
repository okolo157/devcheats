import type { Category } from "./commands";

export interface Recipe {
  id: string;
  title: string;
  problem: string;
  category: Category;
  commands: { label: string; command: string; platform?: string; destructive?: boolean }[];
  notes: string[];
  relatedCommands: string[];
  relatedWorkflows: string[];
}

export const recipes: Recipe[] = [
  {
    id: "kill-port-3000",
    title: "Find and kill whatever is using port 3000",
    problem: "A local dev server failed because port 3000 is occupied.",
    category: "shell",
    commands: [
      { label: "Find process (macOS/Linux)", command: "lsof -i :3000", platform: "macOS/Linux" },
      { label: "Kill by PID", command: "kill -9 <PID>", platform: "macOS/Linux", destructive: true },
      { label: "Alternative one-liner", command: "lsof -ti :3000 | xargs kill -9", platform: "macOS/Linux", destructive: true },
    ],
    notes: [
      "Use a normal kill before SIGKILL when possible.",
      "Verify the port is free with a second lsof check.",
    ],
    relatedCommands: ["lsof", "kill", "ps"],
    relatedWorkflows: ["Find which process is using a port"],
  },
  {
    id: "reset-git-branch",
    title: "Completely reset a local Git branch",
    problem: "Your local branch is broken and you want a clean copy from origin.",
    category: "git",
    commands: [
      { label: "Fetch latest refs", command: "git fetch origin" },
      { label: "Switch to branch", command: "git checkout <branch>" },
      { label: "Hard reset to remote", command: "git reset --hard origin/<branch>", destructive: true },
      { label: "Remove untracked files", command: "git clean -fd", destructive: true },
    ],
    notes: [
      "Stash or back up local work before destructive commands.",
      "Use --dry-run with git clean first when unsure.",
    ],
    relatedCommands: ["git fetch --prune", "git reset --hard", "git clean -fd"],
    relatedWorkflows: ["Undo last commit", "Compare branches"],
  },
  {
    id: "docker-clean-dev",
    title: "Clean a Docker development environment",
    problem: "Docker disk usage is high and stale containers/images are piling up.",
    category: "docker",
    commands: [
      { label: "See disk usage", command: "docker system df" },
      { label: "Remove stopped containers", command: "docker container prune -f", destructive: true },
      { label: "Remove dangling images", command: "docker image prune -f", destructive: true },
      { label: "Aggressive full cleanup", command: "docker system prune -a --volumes -f", destructive: true },
    ],
    notes: [
      "Start with targeted prune commands first.",
      "The full prune command can remove images/volumes needed later.",
    ],
    relatedCommands: ["docker ps -a", "docker system prune", "docker volume ls"],
    relatedWorkflows: ["Clean Docker disk usage"],
  },
  {
    id: "diagnose-slow-api",
    title: "Diagnose a slow HTTP API",
    problem: "An endpoint feels slow and you need evidence before changing code.",
    category: "performance",
    commands: [
      { label: "Measure total timings", command: "curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://api.example.com/health" },
      { label: "Inspect response headers", command: "curl -I https://api.example.com/endpoint" },
      { label: "Trace DNS resolution", command: "dig +short api.example.com" },
      { label: "Correlate app logs", command: "grep 'request_id=<id>' /var/log/app.log" },
    ],
    notes: [
      "Compare fast and slow requests with the same payload.",
      "Check if latency is network, app, or database bound.",
    ],
    relatedCommands: ["curl -w", "dig", "grep"],
    relatedWorkflows: ["Ask an agent to investigate a performance issue"],
  },
  {
    id: "remove-leaked-secret",
    title: "Safely remove a leaked secret from Git history",
    problem: "A credential was committed and must be revoked and removed.",
    category: "security",
    commands: [
      { label: "Revoke/rotate secret first", command: "# rotate credentials in provider console", destructive: true },
      { label: "Scan for remaining leaks", command: "git grep -n '<secret-pattern>'" },
      { label: "Rewrite history", command: "git filter-repo --path <file> --invert-paths", destructive: true },
      { label: "Force push rewritten refs", command: "git push --force --all", destructive: true },
    ],
    notes: [
      "Secret rotation is the first priority; history rewrite is second.",
      "Coordinate with the team before force-pushing rewritten history.",
    ],
    relatedCommands: ["git filter-repo", "git push --force-with-lease", "git reflog"],
    relatedWorkflows: ["Remove sensitive files from Git history"],
  },
];
