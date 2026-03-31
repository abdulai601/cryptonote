import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { DataTableShell } from "@/components/program/data-table-shell";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/contacts">;

export default async function ContactsPage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} Contact Listing`}
      subtitle="Program and facility contacts"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "Contact Listing"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="contacts" />
        <DataTableShell
          title="Contact Listing"
          description="Contact records used by workflow communications and roster support."
        />
      </div>
    </PageShell>
  );
}
