import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { PROGRAM_CONFIGS } from "@/lib/payroll/program-config";

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      subtitle="Shared OMH payroll roster operations across Standby, ES, and PESP"
      breadcrumbs={["Dashboard"]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {Object.values(PROGRAM_CONFIGS).map((program) => (
          <Card
            key={program.slug}
            title={program.name}
            subtitle={`${program.monthlyRosterTitle} / ${program.facilityRosterTitle}`}
          >
            <div className="space-y-2 text-xs text-slate-600">
              <p>Workbook Source: {program.sourceWorkbookName}</p>
              <p>Active Rule: {program.activeRuleSummary}</p>
              <p>Dedupe Rule: {program.activeDedupeSummary}</p>
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/programs/${program.slug}/home`}
                  className="rounded-md bg-blue-600 px-3 py-1.5 font-semibold text-white"
                >
                  Open Program
                </Link>
                <Link
                  href={`/programs/${program.slug}/monthly-roster`}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700"
                >
                  Monthly Roster
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Workflow Parity Checklist">
          <ol className="list-decimal space-y-1 pl-5 text-xs text-slate-600">
            <li>Select program module.</li>
            <li>Enter control number for monthly roster.</li>
            <li>Choose include-active option.</li>
            <li>Populate Additions, Changes, Deletions, Active.</li>
            <li>Sort rows and render preview.</li>
            <li>Export official PDF/Excel and log action.</li>
            <li>Generate facility roster by facility code.</li>
          </ol>
        </Card>

        <Card title="System Modules">
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
            <li>Current-Year and Master databases</li>
            <li>Workbook import and sync staging</li>
            <li>Official roster generation engine</li>
            <li>Ad hoc report builder with saved definitions</li>
            <li>Audit logs and export job history</li>
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
