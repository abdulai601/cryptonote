import { PropsWithChildren } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProgramSlug } from "@/types/payroll";

type PageShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  activeProgram?: ProgramSlug;
  breadcrumbs?: string[];
}>;

export function PageShell({
  title,
  subtitle,
  activeProgram,
  breadcrumbs,
  children,
}: PageShellProps) {
  return (
    <AppShell
      title={title}
      subtitle={subtitle}
      activeProgram={activeProgram}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </AppShell>
  );
}
