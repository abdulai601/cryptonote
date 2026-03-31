import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { Card } from "@/components/ui/card";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/log">;

const recentActions = [
  "POPULATE_MONTHLY_ROSTER",
  "CREATE_FACILITY_ROSTER",
  "IMPORT_COMMIT",
  "EXPORT_PDF",
  "UPDATE_ROW",
];

export default async function ProgramLogPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Log`}
      subtitle="Program action audit trail"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Log"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="log" />
        <Card title="Recent Audit Actions" subtitle="Persisted audit log records from database">
          <div className="space-y-2">
            {recentActions.map((action) => (
              <div
                key={action}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
              >
                {action}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
