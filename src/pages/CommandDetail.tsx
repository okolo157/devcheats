import { useParams } from "react-router-dom";
import { getCommandBySlug } from "@/lib/detail-items";
import { useSeo } from "@/hooks/use-seo";
import { DetailLayout } from "@/components/DetailLayout";
import { CopyButton } from "@/components/CopyButton";
import NotFound from "./NotFound";

const CommandDetail = () => {
  const { slug = "" } = useParams();
  const command = getCommandBySlug(slug);

  useSeo(`/commands/${slug}`);

  if (!command) return <NotFound />;

  return (
    <DetailLayout tabPath="/commands" tabLabel="Commands" category={command.category} title={command.title}>
      {command.description && <p className="mb-4 text-sm text-muted-foreground">{command.description}</p>}

      <div className="relative">
        <pre className="overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-sm text-cmd-code">
          <code>{command.command}</code>
        </pre>
        <div className="mt-3">
          <CopyButton text={command.command} label="Copy command" />
        </div>
      </div>

      {command.example && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium text-foreground">Example</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-xs text-cmd-code">
            <code>{command.example}</code>
          </pre>
        </div>
      )}

      {command.flags && command.flags.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium text-foreground">Flags</p>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {command.flags.map((flag) => (
              <li key={flag} className="font-mono">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(command.safety || command.platform?.length) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {command.safety && (
            <span className="rounded border border-border px-1.5 py-0.5 font-mono">
              {command.safety === "destructive" ? "Destructive" : "Safe"}
            </span>
          )}
          {command.platform?.map((item) => (
            <span key={item} className="rounded border border-border px-1.5 py-0.5 font-mono">
              {item}
            </span>
          ))}
        </div>
      )}

      {command.relatedCommands && command.relatedCommands.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          <span className="text-foreground">Related commands:</span> {command.relatedCommands.join(", ")}
        </p>
      )}
    </DetailLayout>
  );
};

export default CommandDetail;
