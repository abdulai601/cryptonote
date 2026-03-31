import { ProgramConfig } from "@/types/payroll";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

type FacilityRosterShellProps = {
  program: ProgramConfig;
};

export function FacilityRosterShell({ program }: FacilityRosterShellProps) {
  return (
    <div className="space-y-4">
      <Card title={program.facilityRosterTitle} subtitle="Official Facility Roster Mode">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs text-slate-700 md:col-span-2">
            Facility Code
            <input
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Enter facility code"
              readOnly
            />
          </label>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
            Generate
          </button>
          <div className="flex gap-2">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              Clear
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              Export PDF
            </button>
          </div>
        </div>
      </Card>

      <Card title="Facility Rules Snapshot">
        <div className="flex flex-wrap gap-2 text-xs">
          <Pill tone="primary">Program: {program.name}</Pill>
          <Pill tone="neutral">Filter: Facility Code + Status = A</Pill>
          <Pill tone="warning">
            Standby/ES use two-row employee blocks; PESP applies additional FY/approval rules.
          </Pill>
        </div>
      </Card>

      <Card title="Roster Preview">
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
          Facility roster preview will render here, preserving workbook-style grouped rows and
          page-ready formatting.
        </div>
      </Card>
    </div>
  );
}

