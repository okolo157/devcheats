import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CommandDetail from "./pages/CommandDetail.tsx";
import WorkflowDetail from "./pages/WorkflowDetail.tsx";
import SkillDetail from "./pages/SkillDetail.tsx";
import RecipeDetail from "./pages/RecipeDetail.tsx";
import AgentWorkflowDetail from "./pages/AgentWorkflowDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/commands" element={<Index />} />
    <Route path="/workflows" element={<Index />} />
    <Route path="/skills" element={<Index />} />
    <Route path="/recipes" element={<Index />} />
    <Route path="/agent-workflows" element={<Index />} />
    <Route path="/commands/:slug" element={<CommandDetail />} />
    <Route path="/workflows/:slug" element={<WorkflowDetail />} />
    <Route path="/skills/:id" element={<SkillDetail />} />
    <Route path="/recipes/:id" element={<RecipeDetail />} />
    <Route path="/agent-workflows/:id" element={<AgentWorkflowDetail />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
