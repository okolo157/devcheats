# More commands + "Load more" browsing

## Why only a few show up

The home page shows every list count in full (e.g. "Commands (524)") but caps each section's preview at a handful of cards, with no way to reveal the rest. Inside each tab, everything renders at once, which is slow and overwhelming.

## Browsing fix

- Each section on the home page and each tab list gets a **Load more** button that reveals the next batch in place (commands in batches of 24, other types in batches of 12).
- The button label shows how many remain, e.g. "Load more (500 remaining)". It disappears when everything is shown.
- Counts stay visible in the section headings so the totals still make sense.
- Changing search text or category filters resets the reveal count back to the first batch.

## New commands

Roughly 200 additions, kept in the existing card format (title, command, description, safety, platform):

- **Cloud & deploy** (new category): AWS CLI (s3, ec2, lambda, ecr, cloudformation), gcloud, Azure CLI, Vercel, Netlify, Fly.io, Cloudflare Wrangler, Heroku, ssh/scp deploys.
- **Kubernetes & infra** (new category): kubectl (get/describe/logs/exec/apply/port-forward/rollout/scale), Helm, Terraform, Ansible, minikube, kustomize, k9s.
- **Databases** (new category): psql, pg_dump/restore, mysql/mysqldump, mongosh, redis-cli, sqlite3, Prisma migrate/studio, Drizzle.
- **Deeper coverage of existing categories**: more Git (worktree, bisect, reflog, submodules, sparse checkout), shell (awk, sed, xargs, lsof, ss, dig, openssl, systemd, cron), package managers (workspaces, audit, publish flows, bunx, corepack), Docker (buildx, multi-stage, healthcheck, prune, registry auth), and AI tooling.
- A few **workflows** to match the new categories: deploy to Vercel, push an image to ECR, run a Terraform plan/apply, restore a Postgres dump, roll back a Kubernetes deployment.

## Technical notes

- `src/lib/category.ts`: add `cloud`, `k8s`, `db` categories with labels, badge and chip styles.
- `src/index.css` + `tailwind.config.ts`: add `--cmd-cloud`, `--cmd-k8s`, `--cmd-db` color tokens in the existing dark palette style.
- `src/data/commands.ts`, `src/data/workflows.ts`: append new entries; keep titles unique enough that the existing slug map stays stable.
- `src/pages/Index.tsx`: replace the hardcoded `.slice(0, n)` previews with per-section reveal state (`useState` counts keyed by section), reset via `useEffect` on `query`/`activeCategories`, and render a shared `LoadMore` button component.
- New `src/components/LoadMore.tsx` for the button.
