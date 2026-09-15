import { useParams } from "react-router-dom";
import { Download, FileCode2 } from "lucide-react";
import { getSkillById } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import NotFound from "./NotFound";

const SkillDetail = () => {
  const { id = "" } = useParams();
  const skill = getSkillById(id);

  useSeo(`/skills/${id}`);

  if (!skill) return <NotFound />;

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
    <DetailLayout
      tabPath="/skills"
      tabLabel="Agent Skills"
      category={skill.category}
      title={skill.name}
      subtitle={skill.description}
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-4 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <FileCode2 className="h-3.5 w-3.5 shrink-0" />
          Save this file as <span className="font-mono text-foreground">{skill.filename}</span> in your
          repository.
        </p>
        <p className="mt-1.5">
          Compatible with: {skill.compatibleTools.join(", ")} — any agent that reads SKILL.md-style
          instruction files.
        </p>
      </div>

      <pre className="max-h-[32rem] overflow-auto rounded-md border border-border bg-card p-3 text-xs text-cmd-code">
        <code>{skill.content}</code>
      </pre>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CopyButton text={skill.content} />
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-3 w-3" /> Download SKILL.md
        </button>
      </div>

      <div className="mt-6 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
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
    </DetailLayout>
  );
};

export default SkillDetail;
