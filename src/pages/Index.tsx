import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layers, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { commands } from "@/data/commands";
import { workflows } from "@/data/workflows";
import { recipes } from "@/data/recipes";
import { agentSkills } from "@/data/skills";
import { agentWorkflows } from "@/data/agentWorkflows";
import { CommandCard } from "@/components/CommandCard";
import { WorkflowCard } from "@/components/WorkflowCard";
import { RecipeCard } from "@/components/RecipeCard";
import { SkillCard } from "@/components/SkillCard";
import { AgentWorkflowCard } from "@/components/AgentWorkflowCard";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";
import { useSeo } from "@/hooks/use-seo";
import logoDark from "/image.png";

type ViewMode = "all" | "commands" | "workflows" | "skills" | "recipes" | "agent-workflows";

const viewLabel: Record<ViewMode, string> = {
  all: "All",
  commands: "Commands",
  workflows: "Workflows",
  skills: "Agent Skills",
  recipes: "Recipes",
  "agent-workflows": "AI Agent Workflows",
};

const pathForView: Record<ViewMode, string> = {
  all: "/",
  commands: "/commands",
  workflows: "/workflows",
  skills: "/skills",
  recipes: "/recipes",
  "agent-workflows": "/agent-workflows",
};

const viewForPath: Record<string, ViewMode> = {
  "/": "all",
  "/commands": "commands",
  "/workflows": "workflows",
  "/skills": "skills",
  "/recipes": "recipes",
  "/agent-workflows": "agent-workflows",
};

const seoContent: Record<ViewMode, { title: string; description: string }> = {
  all: {
    title: "DevCheats — The Ultimate Dev Command Reference",
    description: `A searchable cheatsheet of ${commands.length}+ Git, Terminal, npm, Docker, and AI commands plus ${workflows.length} workflows, ${agentSkills.length} agent skills, and ${recipes.length} recipes for developers.`,
  },
  commands: {
    title: "Dev Commands Cheatsheet",
    description: `Browse ${commands.length}+ Git, Docker, npm, and terminal commands with flags, examples, and copy-paste snippets.`,
  },
  workflows: {
    title: "Developer Workflows",
    description: `${workflows.length} multi-step workflows for common development tasks, from git rebasing to deployment.`,
  },
  skills: {
    title: "AI Agent Skills",
    description: `${agentSkills.length} reusable AI agent skills for Claude, Cursor, and other coding agents.`,
  },
  recipes: {
    title: "Dev Recipes",
    description: `${recipes.length} practical recipes and snippets for everyday development tasks.`,
  },
  "agent-workflows": {
    title: "AI Coding Agent Workflows",
    description: `${agentWorkflows.length} end-to-end workflows for AI coding agents like Claude Code and Cursor.`,
  },
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const view = viewForPath[location.pathname] ?? "all";

  useSeo({
    title: seoContent[view].title,
    description: seoContent[view].description,
    path: pathForView[view],
  });

  const query = search.trim().toLowerCase();

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(cmd.category);
      const matchesSearch =
        !query ||
        cmd.title.toLowerCase().includes(query) ||
        cmd.command.toLowerCase().includes(query) ||
        cmd.description?.toLowerCase().includes(query) ||
        cmd.flags?.some((flag) => flag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, query]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(workflow.category);
      const matchesSearch =
        !query ||
        workflow.title.toLowerCase().includes(query) ||
        workflow.description.toLowerCase().includes(query) ||
        workflow.problem?.toLowerCase().includes(query) ||
        workflow.whenToUse?.toLowerCase().includes(query) ||
        workflow.steps.some(
          (step) => step.label.toLowerCase().includes(query) || step.command.toLowerCase().includes(query),
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, query]);

  const filteredSkills = useMemo(() => {
    return agentSkills.filter((skill) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(skill.category);
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        skill.compatibleTools.some((tool) => tool.toLowerCase().includes(query)) ||
        skill.formats.some((format) => format.content.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, query]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(recipe.category);
      const matchesSearch =
        !query ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.problem.toLowerCase().includes(query) ||
        recipe.notes.some((note) => note.toLowerCase().includes(query)) ||
        recipe.commands.some((entry) =>
          `${entry.label} ${entry.command} ${entry.platform ?? ""}`.toLowerCase().includes(query),
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, query]);

  const filteredAgentWorkflows = useMemo(() => {
    return agentWorkflows.filter((workflow) => {
      const matchesCategory = activeCategories.size === 0 || activeCategories.has(workflow.category);
      const matchesSearch =
        !query ||
        workflow.title.toLowerCase().includes(query) ||
        workflow.goal.toLowerCase().includes(query) ||
        workflow.context.some((item) => item.toLowerCase().includes(query)) ||
        workflow.agentInstructions.some((item) => item.toLowerCase().includes(query)) ||
        workflow.verification.some((item) => item.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategories, query]);

  const categories = useMemo(() => {
    const source =
      view === "commands"
        ? commands
        : view === "workflows"
          ? workflows
          : view === "skills"
            ? agentSkills
            : view === "recipes"
              ? recipes
              : view === "agent-workflows"
                ? agentWorkflows
                : [...commands, ...workflows, ...agentSkills, ...recipes, ...agentWorkflows];

    return Array.from(new Set(source.map((item) => item.category))).sort((a, b) =>
      getCategoryLabel(a).localeCompare(getCategoryLabel(b)),
    );
  }, [view]);

  const toggleCategory = (category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const totalItems =
    commands.length + workflows.length + agentSkills.length + recipes.length + agentWorkflows.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoDark} alt="DevCheats logo" className="h-8 w-8 object-contain" />
              <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">DevCheats</h1>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search commands, workflows, skills, and recipes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="border-border bg-card pl-9 font-mono text-sm"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="mr-2 flex overflow-hidden rounded-md border border-border">
              {Object.entries(viewLabel).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => navigate(pathForView[key as ViewMode])}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    view === key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {key === "workflows" ? (
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {label}
                    </span>
                  ) : (
                    label
                  )}
                </button>
              ))}
            </div>

            {categories.map((category) => {
              const isActive = activeCategories.has(category);
              const styles = getCategoryStyles(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    isActive ? styles.chipActive : styles.chipInactive
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              );
            })}

            {activeCategories.size > 0 && (
              <button
                onClick={() => setActiveCategories(new Set())}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {view === "all" ? (
          <div className="space-y-8">
            {filteredCommands.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Commands ({filteredCommands.length})</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCommands.slice(0, query ? filteredCommands.length : 9).map((command, index) => (
                    <CommandCard key={`cmd-${index}-${command.title}`} {...command} />
                  ))}
                </div>
              </section>
            )}

            {filteredWorkflows.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Workflows ({filteredWorkflows.length})</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredWorkflows.slice(0, query ? filteredWorkflows.length : 8).map((workflow, index) => (
                    <WorkflowCard key={`wf-${index}-${workflow.title}`} {...workflow} />
                  ))}
                </div>
              </section>
            )}

            {filteredSkills.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Agent Skills ({filteredSkills.length})</h2>
                <div className="grid gap-3 lg:grid-cols-2">
                  {filteredSkills.slice(0, query ? filteredSkills.length : 6).map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
              </section>
            )}

            {filteredRecipes.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Recipes ({filteredRecipes.length})</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredRecipes.slice(0, query ? filteredRecipes.length : 4).map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))}
                </div>
              </section>
            )}

            {filteredAgentWorkflows.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  AI Coding Agent Workflows ({filteredAgentWorkflows.length})
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredAgentWorkflows
                    .slice(0, query ? filteredAgentWorkflows.length : 4)
                    .map((workflow) => (
                      <AgentWorkflowCard key={workflow.id} {...workflow} />
                    ))}
                </div>
              </section>
            )}

            {totalItems > 0 &&
              filteredCommands.length === 0 &&
              filteredWorkflows.length === 0 &&
              filteredSkills.length === 0 &&
              filteredRecipes.length === 0 &&
              filteredAgentWorkflows.length === 0 && (
                <p className="py-12 text-center font-mono text-sm text-muted-foreground">No results found.</p>
              )}
          </div>
        ) : view === "commands" ? (
          filteredCommands.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted-foreground">No commands found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCommands.map((command, index) => (
                <CommandCard key={`command-${index}-${command.title}`} {...command} />
              ))}
            </div>
          )
        ) : view === "workflows" ? (
          filteredWorkflows.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted-foreground">No workflows found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredWorkflows.map((workflow, index) => (
                <WorkflowCard key={`workflow-${index}-${workflow.title}`} {...workflow} />
              ))}
            </div>
          )
        ) : view === "skills" ? (
          filteredSkills.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted-foreground">No skills found.</p>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} {...skill} />
              ))}
            </div>
          )
        ) : view === "recipes" ? (
          filteredRecipes.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-muted-foreground">No recipes found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          )
        ) : filteredAgentWorkflows.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted-foreground">No AI workflows found.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredAgentWorkflows.map((workflow) => (
              <AgentWorkflowCard key={workflow.id} {...workflow} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center font-mono text-xs text-muted-foreground sm:px-6">
          {commands.length} commands · {workflows.length} workflows · {agentSkills.length} skills ·{" "}
          {recipes.length} recipes · {agentWorkflows.length} AI workflows
        </div>
      </footer>
    </div>
  );
};

export default Index;
