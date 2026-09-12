import { useParams } from "react-router-dom";
import { getWorkflowBySlug } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import NotFound from "./NotFound";

const WorkflowDetail = () => {
  const { slug = "" } = useParams();
  const workflow = getWorkflowBySlug(slug);

  useSeo(`/workflows/${slug}`);

  if (!workflow) return <NotFound />;

  const allCommands = workflow.steps.map((s) => s.command).join("\n");

  return (
    <DetailLayout
      tabPath="/workflows"
      tabLabel="Workflows"
      category={workflow.category}
      title={workflow.title}
      subtitle={workflow.description}
    >
      {workflow.problem && (
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Problem:</span> {workflow.problem}
        </p>
      )}
      {workflow.whenToUse && (
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">When to use:</span> {workflow.whenToUse}
        </p>
      )}
      {workflow.prerequisites && workflow.prerequisites.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Prerequisites:</span> {workflow.prerequisites.join(", ")}
        </p>
      )}

      <ol className="space-y-3">
        {workflow.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-sm text-muted-foreground">{step.label}</p>
              {step.expectedOutput && (
                <p className="mb-1 text-xs text-muted-foreground/90">Expected: {step.expectedOutput}</p>
              )}
              <pre className="overflow-x-auto rounded-md border border-border bg-card px-3 py-2 font-mono text-sm text-cmd-code">
                <code>{step.command}</code>
              </pre>
            </div>
          </li>
        ))}
      </ol>

      {workflow.commonMistakes && workflow.commonMistakes.length > 0 && (
        <div className="mt-4 rounded-md border border-border/80 bg-card/60 p-3">
          <p className="mb-1 text-xs font-medium text-foreground">Common mistakes</p>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {workflow.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <CopyButton text={allCommands} label="Copy all commands" />
      </div>

      {workflow.relatedCommands && workflow.relatedCommands.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          <span className="text-foreground">Related commands:</span> {workflow.relatedCommands.join(", ")}
        </p>
      )}
      {workflow.relatedWorkflows && workflow.relatedWorkflows.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-foreground">Related workflows:</span> {workflow.relatedWorkflows.join(", ")}
        </p>
      )}
    </DetailLayout>
  );
};

export default WorkflowDetail;
