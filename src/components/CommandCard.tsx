import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Command } from "@/data/commands";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";

export function CommandCard({ title, command, category, description, safety, platform }: Command) {
  const [copied, setCopied] = useState(false);
  const categoryStyles = getCategoryStyles(category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Badge variant="outline" className={`shrink-0 text-[10px] ${categoryStyles.badge}`}>
          {getCategoryLabel(category)}
        </Badge>
      </div>
      {description && <p className="mb-2 text-xs text-muted-foreground">{description}</p>}
      <div className="relative">
        <pre className="overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-sm text-cmd-code">
          <code>{command}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
          aria-label="Copy command"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cmd-shell" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      {(safety || platform?.length) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
          {safety && (
            <span className="rounded border border-border px-1.5 py-0.5 font-mono">
              {safety === "destructive" ? "Destructive" : "Safe"}
            </span>
          )}
          {platform?.map((item) => (
            <span key={item} className="rounded border border-border px-1.5 py-0.5 font-mono">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
