import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AgentWorkflow } from "@/data/agentWorkflows";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";

export function AgentWorkflowCard(workflow: AgentWorkflow) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const styles = getCategoryStyles(workflow.category);

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const content = [
      `Goal: ${workflow.goal}`,
      "",
      "Context:",
      ...workflow.context.map((item) => `- ${item}`),
      "",
      "Agent instructions:",
      ...workflow.agentInstructions.map((item) => `- ${item}`),
      "",
      "Verification:",
      ...workflow.verification.map((item) => `- ${item}`),
      "",
      `Expected result: ${workflow.expectedResult}`,
    ].join("\n");

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">{workflow.title}</h3>
            <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
              {getCategoryLabel(workflow.category)}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{workflow.goal}</p>
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-border px-4 pb-4 pt-3 text-xs text-muted-foreground">
          <div>
            <p className="mb-1 font-medium text-foreground">Goal</p>
            <p>{workflow.goal}</p>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Context</p>
            <ul className="list-disc space-y-1 pl-4">
              {workflow.context.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Agent instructions</p>
            <ul className="list-disc space-y-1 pl-4">
              {workflow.agentInstructions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Verification</p>
            <ul className="list-disc space-y-1 pl-4">
              {workflow.verification.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p><span className="font-medium text-foreground">Expected result:</span> {workflow.expectedResult}</p>
          <p><span className="font-medium text-foreground">Compatible tools:</span> {workflow.compatibleTools.join(", ")}</p>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-cmd-shell" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy workflow template"}
          </button>
        </div>
      )}
    </div>
  );
}
