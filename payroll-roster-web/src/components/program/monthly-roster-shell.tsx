import { ProgramConfig } from "@/types/payroll";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

const sectionCards = ["Additions", "Changes", "Deletions", "Active"] as const;

type MonthlyRosterShellProps = {
  program: ProgramConfig;
};

export function MonthlyRosterShell({ program }: MonthlyRosterShellProps) {
  return (
    <div className="space-y-4">
      <Card title={program.monthlyRosterTitle} subtitle="Official Roster Mode">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1 text-xs text-slate-700">
            Control Number
            <input
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Enter control number"
              readOnly
            />
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            <input type="checkbox" defaultChecked={program.includeActiveDefault} readOnly />
            Include Active Section
          </label>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
            Generate
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Clear
          </button>
          <div className="flex gap-2">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              Export PDF
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              Export Excel
            </button>
          </div>
        </div>
      </Card>

      <Card title="Legacy Logic Snapshot">
        <div className="flex flex-wrap gap-2 text-xs">
          <Pill tone="primary">Source: {program.sourceWorkbookName}</Pill>
          <Pill tone="neutral">Active Rule: {program.activeRuleSummary}</Pill>
          <Pill tone="neutral">Dedupe: {program.activeDedupeSummary}</Pill>
          <Pill tone="neutral">Sort: {program.sortSummary}</Pill>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sectionCards.map((section) => (
          <Card
            key={section}
            title={section}
            subtitle="Preview section rows (rendered from roster run payload)"
          >
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
              No rows generated yet. Run monthly roster to populate this section.
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

