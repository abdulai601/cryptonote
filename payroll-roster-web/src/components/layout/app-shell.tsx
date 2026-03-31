import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ProgramSlug } from "@/types/payroll";

type AppShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  activeProgram?: ProgramSlug;
  showSidebar?: boolean;
  breadcrumbs?: string[];
}>;

export function AppShell({
  title,
  subtitle,
  activeProgram,
  showSidebar = true,
  breadcrumbs,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {showSidebar && <Sidebar activeProgram={activeProgram} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          activeProgram={activeProgram}
          breadcrumbs={breadcrumbs}
        />
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

