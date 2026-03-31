import { PageShell } from "@/components/layout/page-shell";
import { ReportBuilderShell } from "@/components/reports/report-builder-shell";

export default function ReportsPage() {
  return (
    <PageShell
      title="Report Builder"
      subtitle="Official roster mode and ad hoc reporting mode"
      breadcrumbs={["Dashboard", "Report Builder"]}
    >
      <ReportBuilderShell />
    </PageShell>
  );
}
