import { ProgramConfig, WorkbookSection, WorkbookSectionKey } from "@/types/payroll";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { DataTableShell } from "@/components/program/data-table-shell";

type ProgramDataPlaceholderPageProps = {
  program: ProgramConfig;
  section: WorkbookSectionKey;
  title: string;
  subtitle: string;
  dataTitle: string;
  dataDescription: string;
};

export function ProgramDataPlaceholderPage({
  program,
  section,
  title,
  subtitle,
  dataTitle,
  dataDescription,
}: ProgramDataPlaceholderPageProps) {
  const activeTab: WorkbookSection | undefined = program.tabs.find((tab) => tab.key === section);

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      activeProgram={program.slug}
      breadcrumbs={["Dashboard", program.name, activeTab?.label ?? "Program"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={program} section={section} />
        <DataTableShell title={dataTitle} description={dataDescription} />
      </div>
    </PageShell>
  );
}
