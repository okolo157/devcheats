import { useParams } from "react-router-dom";
import { getAgentWorkflowById } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import NotFound from "./NotFound";

const AgentWorkflowDetail = () => {
  const { id = "" } = useParams();
  const workflow = getAgentWorkflowById(id);

  useSeo(`/agent-workflows/${id}`);

  if (!workflow) return <NotFound />;

  const template = [
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

  return (
    <DetailLayout
      tabPath="/agent-workflows"
      tabLabel="AI Agent Workflows"
      category={workflow.category}
      title={workflow.title}
      subtitle={workflow.goal}
    >
      <div className="space-y-4 text-sm text-muted-foreground">
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
        <p>
          <span className="font-medium text-foreground">Expected result:</span> {workflow.expectedResult}
        </p>
        <p>
          <span className="font-medium text-foreground">Compatible tools:</span> {workflow.compatibleTools.join(", ")}
        </p>
      </div>

      <div className="mt-4">
        <CopyButton text={template} label="Copy workflow template" />
      </div>
    </DetailLayout>
  );
};

export default AgentWorkflowDetail;
