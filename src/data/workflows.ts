import type { Category } from "./commands";

export interface Workflow {
  title: string;
  description: string;
  category: Category;
  problem?: string;
  whenToUse?: string;
  prerequisites?: string[];
  steps: { label: string; command: string; expectedOutput?: string }[];
  commonMistakes?: string[];
  relatedWorkflows?: string[];
  relatedCommands?: string[];
}

export const workflows: Workflow[] = [
  {
    title: "Undo last commit",
    description: "Undo the latest commit while preserving your local changes.",
    category: "git",
    problem: "The latest commit should be adjusted before sharing.",
    whenToUse: "Before pushing or when rewriting local history is acceptable.",
    prerequisites: ["Local repository"],
    steps: [
      { label: "Keep changes staged", command: "git reset --soft HEAD~1", expectedOutput: "HEAD moves back one commit" },
      { label: "Verify state", command: "git status", expectedOutput: "Changes shown as staged" },
      { label: "Recommit", command: "git commit -m \"<new message>\"" },
    ],
    commonMistakes: ["Using --hard when you still need changes."],
    relatedWorkflows: ["Undo a pushed commit", "Squash commits"],
    relatedCommands: ["git reset --soft", "git status"],
  },
  {
    title: "Undo a pushed commit",
    description: "Safely reverse a commit that is already on remote.",
    category: "git",
    problem: "A bad commit is already pushed and shared with others.",
    whenToUse: "When you need a safe rollback without rewriting shared history.",
    prerequisites: ["Clean working tree", "Commit SHA"],
    steps: [
      { label: "Inspect recent commits", command: "git log --oneline -n 10" },
      { label: "Revert commit", command: "git revert <commit-sha>" },
      { label: "Push revert", command: "git push origin <branch>" },
    ],
    commonMistakes: ["Force-pushing shared branches without coordination."],
    relatedWorkflows: ["Recover lost commits with reflog"],
    relatedCommands: ["git revert", "git log"],
  },
  {
    title: "Recover lost commits with reflog",
    description: "Find and restore commits after reset/rebase mistakes.",
    category: "git",
    steps: [
      { label: "Open reflog", command: "git reflog" },
      { label: "Find desired HEAD", command: "git show <reflog-sha>" },
      { label: "Restore via branch", command: "git checkout -b recovery/<name> <reflog-sha>" },
    ],
    commonMistakes: ["Running gc aggressively before recovery."],
    relatedCommands: ["git reflog", "git checkout -b"],
  },
  {
    title: "Interactive rebase",
    description: "Rewrite recent commits to clean history before merge.",
    category: "git",
    steps: [
      { label: "Start rebase", command: "git rebase -i HEAD~<n>" },
      { label: "Edit picks", command: "# reorder/squash/fixup commits" },
      { label: "Continue", command: "git rebase --continue" },
      { label: "Push update", command: "git push --force-with-lease" },
    ],
    commonMistakes: ["Rebasing shared/public commits unexpectedly."],
    relatedCommands: ["git rebase --abort", "git push --force-with-lease"],
  },
  {
    title: "Create Git worktrees",
    description: "Work on multiple branches simultaneously in separate directories.",
    category: "git",
    steps: [
      { label: "Create worktree", command: "git worktree add ../feature-x -b feature/x" },
      { label: "List worktrees", command: "git worktree list" },
      { label: "Remove worktree", command: "git worktree remove ../feature-x" },
    ],
    relatedCommands: ["git worktree add", "git worktree list"],
  },
  {
    title: "Find who changed a line",
    description: "Track ownership/history for a specific line range.",
    category: "git",
    steps: [
      { label: "Blame file", command: "git blame -L <start>,<end> <file>" },
      { label: "Inspect commit", command: "git show <sha>" },
      { label: "Understand intent", command: "git log -p -- <file>" },
    ],
    relatedCommands: ["git blame", "git show"],
  },
  {
    title: "Find running containers",
    description: "List active Docker containers with useful context.",
    category: "docker",
    steps: [
      { label: "List running containers", command: "docker ps" },
      { label: "List all containers", command: "docker ps -a" },
      { label: "Inspect specific container", command: "docker inspect <container-id>" },
    ],
    relatedCommands: ["docker ps", "docker inspect"],
  },
  {
    title: "View Docker Compose logs",
    description: "Stream or inspect logs for one service or full compose stack.",
    category: "docker",
    steps: [
      { label: "All services logs", command: "docker compose logs" },
      { label: "Follow one service", command: "docker compose logs -f <service>" },
      { label: "Restart one service", command: "docker compose restart <service>" },
    ],
    relatedCommands: ["docker compose logs -f", "docker compose restart"],
  },
  {
    title: "Clean Docker disk usage",
    description: "Recover Docker disk space progressively.",
    category: "docker",
    steps: [
      { label: "Check usage", command: "docker system df" },
      { label: "Prune stopped containers", command: "docker container prune -f" },
      { label: "Prune unused images", command: "docker image prune -a -f" },
      { label: "Prune everything", command: "docker system prune -a --volumes -f" },
    ],
    commonMistakes: ["Running full prune without confirming required volumes."],
    relatedCommands: ["docker system df", "docker system prune"],
  },
  {
    title: "Find which process is using a port",
    description: "Identify PID listening on a specific port.",
    category: "shell",
    steps: [
      { label: "macOS/Linux", command: "lsof -i :<port>" },
      { label: "Linux alt", command: "ss -lptn 'sport = :<port>'" },
      { label: "Kill process", command: "kill -15 <pid>" },
    ],
    relatedCommands: ["lsof", "ss", "kill"],
  },
  {
    title: "Find large files",
    description: "Locate largest files in a project while excluding noise directories.",
    category: "shell",
    steps: [
      { label: "Top 20 files", command: "find . -type f -not -path '*/node_modules/*' -exec du -h {} + | sort -hr | head -20" },
      { label: "Top directories", command: "du -h --max-depth=2 . | sort -hr | head -20" },
    ],
    relatedCommands: ["find", "du", "sort"],
  },
  {
    title: "Check HTTP response headers",
    description: "Inspect HTTP headers to debug caching, auth, and CDN behavior.",
    category: "shell",
    steps: [
      { label: "Head request", command: "curl -I https://example.com" },
      { label: "Verbose request", command: "curl -sv https://example.com -o /dev/null" },
    ],
    relatedCommands: ["curl -I", "curl -sv"],
  },
  {
    title: "Reinstall Node dependencies cleanly",
    description: "Reset dependencies when lockfile/module state is inconsistent.",
    category: "node",
    prerequisites: ["Correct package manager for the project"],
    steps: [
      { label: "Remove modules and lockfiles", command: "rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock bun.lockb" },
      { label: "Install via npm", command: "npm install" },
      { label: "Install via pnpm", command: "pnpm install" },
      { label: "Install via yarn", command: "yarn install" },
      { label: "Install via bun", command: "bun install" },
    ],
    commonMistakes: ["Mixing multiple lockfiles in a single project."],
    relatedCommands: ["npm ci", "pnpm install", "yarn install", "bun install"],
  },
  {
    title: "Find outdated JavaScript packages",
    description: "Check outdated dependencies across package managers.",
    category: "node",
    steps: [
      { label: "npm", command: "npm outdated" },
      { label: "pnpm", command: "pnpm outdated" },
      { label: "yarn", command: "yarn outdated" },
      { label: "bun", command: "bun outdated" },
    ],
    relatedWorkflows: ["Dependency Upgrade Skill"],
    relatedCommands: ["npm outdated", "pnpm outdated"],
  },
  {
    title: "Create Python virtual environment",
    description: "Create and activate an isolated Python environment.",
    category: "python",
    steps: [
      { label: "Create venv", command: "python -m venv .venv" },
      { label: "Activate macOS/Linux", command: "source .venv/bin/activate" },
      { label: "Install requirements", command: "pip install -r requirements.txt" },
    ],
    relatedCommands: ["python -m venv", "pip install"],
  },
  {
    title: "Manage Python projects with uv and Poetry",
    description: "Use modern Python tooling for dependency and environment management.",
    category: "python",
    steps: [
      { label: "Create project with uv", command: "uv init" },
      { label: "Add dependency with uv", command: "uv add <package>" },
      { label: "Install with Poetry", command: "poetry install" },
      { label: "Run tests in Poetry env", command: "poetry run pytest" },
    ],
    relatedCommands: ["uv add", "poetry install", "poetry run"],
  },
  {
    title: "Inspect Kubernetes pod and logs",
    description: "Inspect pod state, events, and logs for debugging.",
    category: "kubernetes",
    steps: [
      { label: "List pods", command: "kubectl get pods -n <namespace>" },
      { label: "Describe pod", command: "kubectl describe pod <pod> -n <namespace>" },
      { label: "Follow logs", command: "kubectl logs -f <pod> -n <namespace>" },
      { label: "Exec into pod", command: "kubectl exec -it <pod> -n <namespace> -- /bin/sh" },
    ],
    relatedCommands: ["kubectl get pods", "kubectl describe", "kubectl logs"],
  },
  {
    title: "Restart and rollback Kubernetes deployment",
    description: "Safely restart deployment and roll back if needed.",
    category: "kubernetes",
    steps: [
      { label: "Restart deployment", command: "kubectl rollout restart deployment/<name> -n <namespace>" },
      { label: "Watch rollout", command: "kubectl rollout status deployment/<name> -n <namespace>" },
      { label: "View rollout history", command: "kubectl rollout history deployment/<name> -n <namespace>" },
      { label: "Rollback", command: "kubectl rollout undo deployment/<name> -n <namespace>" },
    ],
    relatedCommands: ["kubectl rollout restart", "kubectl rollout undo"],
  },
  {
    title: "Connect and inspect PostgreSQL",
    description: "Connect to PostgreSQL, list databases/tables, and inspect indexes.",
    category: "database",
    steps: [
      { label: "Connect", command: "psql postgresql://<user>:<pass>@<host>:5432/<db>" },
      { label: "List databases", command: "\\l" },
      { label: "List tables", command: "\\dt" },
      { label: "Describe table", command: "\\d+ <table>" },
      { label: "Find active queries", command: "SELECT pid, state, query FROM pg_stat_activity WHERE state <> 'idle';" },
    ],
    commonMistakes: ["Running kill/terminate query commands without confirming ownership."],
    relatedCommands: ["psql", "\\dt", "pg_stat_activity"],
  },
  {
    title: "Inspect and clear Redis safely",
    description: "Inspect Redis keys and clear targeted cache data.",
    category: "database",
    steps: [
      { label: "Connect", command: "redis-cli -h <host> -p <port>" },
      { label: "Check key count", command: "DBSIZE" },
      { label: "Scan keys", command: "SCAN 0 MATCH <prefix>* COUNT 100" },
      { label: "Delete key", command: "DEL <key>" },
      { label: "Flush DB (destructive)", command: "FLUSHDB" },
    ],
    commonMistakes: ["Using FLUSHALL/FLUSHDB in production without explicit approval."],
    relatedCommands: ["redis-cli", "SCAN", "DEL"],
  },
];
