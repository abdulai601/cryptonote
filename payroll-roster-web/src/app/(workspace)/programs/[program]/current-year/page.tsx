import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { DataTableShell } from "@/components/program/data-table-shell";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/current-year">;

export default async function CurrentYearPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Current-Year Database`}
      subtitle="Operational records for active fiscal year"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Current-Year Database"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="current-year" />
        <DataTableShell
          title="Current-Year Database"
          description="Editable operational dataset with workbook-compatible fields."
        />
      </div>
    </PageShell>
  );
}
