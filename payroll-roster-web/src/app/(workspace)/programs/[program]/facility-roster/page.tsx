import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { FacilityRosterShell } from "@/components/program/facility-roster-shell";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/facility-roster">;

export default async function FacilityRosterPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Facility Roster`}
      subtitle="Facility-code driven official facility roster generation"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Facility Roster"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="facility-roster" />
        <FacilityRosterShell program={programConfig} />
      </div>
    </PageShell>
  );
}
