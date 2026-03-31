import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProgramPageHeader } from "@/components/program/program-page-header";
import { Card } from "@/components/ui/card";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";

type ProgramPageProps = PageProps<"/programs/[program]/signature">;

export default async function SignaturePage(props: ProgramPageProps) {
  const { program } = await props.params;
  const programConfig = resolveProgramConfig(program);

  if (!programConfig) {
    notFound();
  }

  return (
    <PageShell
      title={`${programConfig.name} DOB Signature`}
      subtitle="Official signature and certificate block settings"
      activeProgram={programConfig.slug}
      breadcrumbs={["Dashboard", programConfig.name, "DOB Signature"]}
    >
      <div className="space-y-4">
        <ProgramPageHeader program={programConfig} section="signature" />
        <Card
          title="Signature Configuration"
          subtitle="Admin-managed settings used by official PDF templates"
        >
          <div className="space-y-3 text-xs text-slate-600">
            <label className="flex flex-col gap-1">
              Approved By Text
              <input
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                value={programConfig.officialSignature}
                readOnly
              />
            </label>
            <label className="flex flex-col gap-1">
              Date Signed Field Label
              <input
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                value="Date Signed"
                readOnly
              />
            </label>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700">
              Save (Admin)
            </button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
