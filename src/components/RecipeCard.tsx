import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recipe } from "@/data/recipes";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";
import { recipeHref } from "@/lib/detail-items";

export function RecipeCard(recipe: Recipe) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const styles = getCategoryStyles(recipe.category);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(recipe.commands.map((command) => command.command).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex w-full items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">{recipe.title}</h3>
              <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
                {getCategoryLabel(recipe.category)}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{recipe.problem}</p>
          </div>
        </button>
        <Link
          to={recipeHref(recipe)}
          aria-label="View full page"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <ol className="space-y-2">
            {recipe.commands.map((item) => (
              <li key={`${recipe.id}-${item.label}`}>
                <p className="mb-1 text-xs text-muted-foreground">{item.label}</p>
                <pre className="overflow-x-auto rounded-md bg-background px-3 py-1.5 text-xs text-cmd-code">
                  <code>{item.command}</code>
                </pre>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  {item.platform && <span>{item.platform}</span>}
                  {item.destructive && (
                    <span className="inline-flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Destructive
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-3 rounded-md border border-border/80 bg-background/60 p-2">
            <p className="mb-1 text-[11px] font-medium text-foreground">Notes</p>
            <ul className="list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
              {recipe.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-cmd-shell" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy recipe commands"}
          </button>
        </div>
      )}
    </div>
  );
}
