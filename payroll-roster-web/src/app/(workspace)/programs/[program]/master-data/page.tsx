import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { DataTableShell } from "@/components/program/data-table-shell";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/master-data">;

export default async function MasterDataPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Master Database`}
      subtitle="All-data historical repository with sync from current-year records"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "All Data / Master Database"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="master-data" />
        <DataTableShell
          title="All Data / Master Database"
          description="Normalized historical dataset supporting official and ad hoc reports."
        />
      </div>
    </PageShell>
  );
}
