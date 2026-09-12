import { categoryLabels } from "@/data/commands";

const palette = [
  {
    badge: "bg-cmd-git/15 text-cmd-git border-cmd-git/30",
    chipActive: "bg-cmd-git/20 text-cmd-git border-cmd-git/40",
    chipInactive: "text-muted-foreground border-border hover:border-cmd-git/30 hover:text-cmd-git",
  },
  {
    badge: "bg-cmd-shell/15 text-cmd-shell border-cmd-shell/30",
    chipActive: "bg-cmd-shell/20 text-cmd-shell border-cmd-shell/40",
    chipInactive: "text-muted-foreground border-border hover:border-cmd-shell/30 hover:text-cmd-shell",
  },
  {
    badge: "bg-cmd-npm/15 text-cmd-npm border-cmd-npm/30",
    chipActive: "bg-cmd-npm/20 text-cmd-npm border-cmd-npm/40",
    chipInactive: "text-muted-foreground border-border hover:border-cmd-npm/30 hover:text-cmd-npm",
  },
  {
    badge: "bg-cmd-docker/15 text-cmd-docker border-cmd-docker/30",
    chipActive: "bg-cmd-docker/20 text-cmd-docker border-cmd-docker/40",
    chipInactive: "text-muted-foreground border-border hover:border-cmd-docker/30 hover:text-cmd-docker",
  },
  {
    badge: "bg-cmd-ai/15 text-cmd-ai border-cmd-ai/30",
    chipActive: "bg-cmd-ai/20 text-cmd-ai border-cmd-ai/40",
    chipInactive: "text-muted-foreground border-border hover:border-cmd-ai/30 hover:text-cmd-ai",
  },
] as const;

const hash = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getCategoryStyles = (category: string) => {
  const index = hash(category.toLowerCase()) % palette.length;
  return palette[index];
};

export const getCategoryLabel = (category: string) => {
  const knownLabel = categoryLabels[category as keyof typeof categoryLabels];
  if (knownLabel) return knownLabel;

  return category
    .split(/[-_\s]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};
