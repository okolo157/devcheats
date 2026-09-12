import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Workflow } from "@/data/workflows";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";
import { workflowHref } from "@/lib/detail-items";

export function WorkflowCard(workflow: Workflow) {
  const { title, description, category, steps, problem, whenToUse, prerequisites, commonMistakes } = workflow;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const categoryStyles = getCategoryStyles(category);

  const handleCopyAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const allCommands = steps.map((s) => s.command).join("\n");
    await navigator.clipboard.writeText(allCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30">
      <div className="flex w-full items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
              <Badge variant="outline" className={`shrink-0 text-[10px] ${categoryStyles.badge}`}>
                {getCategoryLabel(category)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
          </div>
          <span className="shrink-0 text-[10px] text-muted-foreground font-mono">{steps.length} steps</span>
        </button>
        <Link
          to={workflowHref(workflow)}
          aria-label="View full page"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {problem && <p className="mb-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">Problem:</span> {problem}</p>}
          {whenToUse && <p className="mb-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">When to use:</span> {whenToUse}</p>}
          {prerequisites?.length ? (
            <p className="mb-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Prerequisites:</span> {prerequisites.join(", ")}
            </p>
          ) : null}
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{step.label}</p>
                  {step.expectedOutput && (
                    <p className="mb-1 text-[11px] text-muted-foreground/90">
                      Expected: {step.expectedOutput}
                    </p>
                  )}
                  <pre className="overflow-x-auto rounded-md bg-background px-3 py-1.5 font-mono text-xs text-cmd-code">
                    <code>{step.command}</code>
                  </pre>
                </div>
              </li>
            ))}
          </ol>
          {commonMistakes?.length ? (
            <div className="mt-3 rounded-md border border-border/80 bg-background/60 p-2">
              <p className="mb-1 text-[11px] font-medium text-foreground">Common mistakes</p>
              <ul className="list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                {commonMistakes.map((mistake) => (
                  <li key={mistake}>{mistake}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <button
            onClick={handleCopyAll}
            className="mt-3 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-cmd-shell" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy all commands
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
