import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { ProgramSectionSummaries } from "@/components/program/program-section-summaries";
import { Card } from "@/components/ui/card";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/home">;

export default async function ProgramHomePage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Home`}
      subtitle={`${programConfig.workbookTitle} module`}
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Home"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="home" />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Workbook Preservation">
            <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
              <li>Tab-equivalent sections maintained in navigation.</li>
              <li>Control-number monthly workflow preserved.</li>
              <li>Facility roster behavior preserved by program config.</li>
              <li>PDF template fidelity handled by export templates.</li>
            </ul>
          </Card>
          <Card title="Data Scope">
            <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
              <li>Current-Year operational data</li>
              <li>Master historical data</li>
              <li>Contacts and facilities</li>
              <li>Import staging with validation and upsert sync</li>
            </ul>
          </Card>
          <Card title="Audit Scope">
            <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
              <li>Roster generation actions</li>
              <li>Imports and sync activity</li>
              <li>Export jobs (PDF/XLSX)</li>
              <li>User/session metadata</li>
            </ul>
          </Card>
        </div>

        <ProgramSectionSummaries program={programConfig} />
      </div>
    </PageShell>
  );
}
