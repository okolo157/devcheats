import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { getRecipeById } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import NotFound from "./NotFound";

const RecipeDetail = () => {
  const { id = "" } = useParams();
  const recipe = getRecipeById(id);

  useSeo(`/recipes/${id}`);

  if (!recipe) return <NotFound />;

  const allCommands = recipe.commands.map((c) => c.command).join("\n");

  return (
    <DetailLayout
      tabPath="/recipes"
      tabLabel="Recipes"
      category={recipe.category}
      title={recipe.title}
      subtitle={recipe.problem}
    >
      <ol className="space-y-3">
        {recipe.commands.map((item) => (
          <li key={`${recipe.id}-${item.label}`}>
            <p className="mb-1 text-sm text-muted-foreground">{item.label}</p>
            <pre className="overflow-x-auto rounded-md border border-border bg-card px-3 py-2 font-mono text-sm text-cmd-code">
              <code>{item.command}</code>
            </pre>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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

      <div className="mt-4 rounded-md border border-border/80 bg-card/60 p-3">
        <p className="mb-1 text-xs font-medium text-foreground">Notes</p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
          {recipe.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <CopyButton text={allCommands} label="Copy recipe commands" />
      </div>

      {recipe.relatedCommands.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          <span className="text-foreground">Related commands:</span> {recipe.relatedCommands.join(", ")}
        </p>
      )}
      {recipe.relatedWorkflows.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-foreground">Related workflows:</span> {recipe.relatedWorkflows.join(", ")}
        </p>
      )}
    </DetailLayout>
  );
};

export default RecipeDetail;
