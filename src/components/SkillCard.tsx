import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgentSkill } from "@/data/skills";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";

export function SkillCard(skill: AgentSkill) {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState(skill.formats[0]?.id ?? "markdown");
  const styles = getCategoryStyles(skill.category);

  const selectedFormat = useMemo(
    () => skill.formats.find((format) => format.id === activeFormat) ?? skill.formats[0],
    [activeFormat, skill.formats],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedFormat.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFormat.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${skill.id}.${selectedFormat.id === "markdown" ? "md" : "txt"}`;
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
        <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
          {getCategoryLabel(skill.category)}
        </Badge>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {skill.tags.map((tag) => (
          <span key={tag} className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <p className="mb-2 text-[11px] text-muted-foreground">
        Compatible: {skill.compatibleTools.join(", ")}
      </p>

      <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as typeof activeFormat)}>
        <TabsList className="mb-2 h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {skill.formats.map((format) => (
            <TabsTrigger key={format.id} value={format.id} className="h-7 border border-border px-2 text-[11px] data-[state=active]:bg-muted">
              {format.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {skill.formats.map((format) => (
          <TabsContent key={format.id} value={format.id} className="mt-0">
            <pre className="max-h-72 overflow-auto rounded-md bg-background p-3 text-[11px] text-cmd-code">
              <code>{format.content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-cmd-shell" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-3 w-3" /> Download raw
        </button>
      </div>

      <div className="mt-3 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
        <p><span className="text-foreground">Related skills:</span> {skill.relatedSkills.join(", ")}</p>
        <p><span className="text-foreground">Related commands:</span> {skill.relatedCommands.join(", ")}</p>
        <p><span className="text-foreground">Related workflows:</span> {skill.relatedWorkflows.join(", ")}</p>
      </div>
    </div>
  );
}
