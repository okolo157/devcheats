import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { getSkillById } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotFound from "./NotFound";

const SkillDetail = () => {
  const { id = "" } = useParams();
  const skill = getSkillById(id);

  useSeo(`/skills/${id}`);

  const [activeFormat, setActiveFormat] = useState(skill?.formats[0]?.id ?? "markdown");
  const selectedFormat = useMemo(
    () => skill?.formats.find((format) => format.id === activeFormat) ?? skill?.formats[0],
    [activeFormat, skill],
  );

  if (!skill || !selectedFormat) return <NotFound />;

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

      <p className="mb-4 text-xs text-muted-foreground">Compatible: {skill.compatibleTools.join(", ")}</p>

      <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as typeof activeFormat)}>
        <TabsList className="mb-2 h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {skill.formats.map((format) => (
            <TabsTrigger
              key={format.id}
              value={format.id}
              className="h-7 border border-border px-2 text-xs data-[state=active]:bg-muted"
            >
              {format.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {skill.formats.map((format) => (
          <TabsContent key={format.id} value={format.id} className="mt-0">
            <pre className="max-h-96 overflow-auto rounded-md border border-border bg-card p-3 text-xs text-cmd-code">
              <code>{format.content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CopyButton text={selectedFormat.content} />
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-3 w-3" /> Download raw
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
