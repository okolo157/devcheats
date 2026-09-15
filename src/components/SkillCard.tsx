import { useState } from "react";
import { Check, Copy, Download, ExternalLink, FileCode2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { AgentSkill } from "@/data/skills";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";
import { skillHref } from "@/lib/detail-items";

export function SkillCard(skill: AgentSkill) {
  const [copied, setCopied] = useState(false);
  const styles = getCategoryStyles(skill.category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(skill.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([skill.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SKILL.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{skill.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{skill.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
            {getCategoryLabel(skill.category)}
          </Badge>
          <Link
            to={skillHref(skill)}
            aria-label="View full page"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <FileCode2 className="h-3 w-3 shrink-0" />
        <span className="font-mono">{skill.filename}</span>
      </p>

      <pre className="max-h-72 overflow-auto rounded-md bg-background p-3 text-[11px] text-cmd-code">
        <code>{skill.content}</code>
      </pre>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-cmd-shell" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy SKILL.md"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-3 w-3" /> Download SKILL.md
        </button>
      </div>

      <div className="mt-3 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
        <p>
          <span className="text-foreground">Related skills:</span> {skill.relatedSkills.join(", ")}
        </p>
        <p>
          <span className="text-foreground">Related commands:</span> {skill.relatedCommands.join(", ")}
        </p>
        <p>
          <span className="text-foreground">Related workflows:</span> {skill.relatedWorkflows.join(", ")}
        </p>
      </div>
    </div>
  );
}
