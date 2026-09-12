import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel, getCategoryStyles } from "@/lib/category";

interface DetailLayoutProps {
  tabPath: string;
  tabLabel: string;
  category: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function DetailLayout({ tabPath, tabLabel, category, title, subtitle, children }: DetailLayoutProps) {
  const styles = getCategoryStyles(category);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={tabPath} className="hover:text-foreground">
              {tabLabel}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-foreground">{title}</h1>
            <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
              {getCategoryLabel(category)}
            </Badge>
          </div>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
