import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { MonthlyRosterShell } from "@/components/program/monthly-roster-shell";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/monthly-roster">;

export default async function MonthlyRosterPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Monthly Roster`}
      subtitle="Control-number driven Additions/Changes/Deletions/Active generation"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Monthly Roster for DOB"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="monthly-roster" />
        <MonthlyRosterShell program={programConfig} />
      </div>
    </PageShell>
  );
}
