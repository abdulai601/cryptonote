import { Card } from "@/components/ui/card";

const filterFields = [
  "Control Number",
  "Facility Code",
  "Facility Name",
  "Category",
  "Status",
  "Begin Date",
  "End Date",
  "DOB Approval",
  "Title",
  "Employee Name",
  "Employee ID",
  "Program Area",
  "Fund",
  "NU",
  "SG",
];

export function ReportBuilderShell() {
  return (
    <div className="space-y-4">
      <Card title="Custom Report Builder" subtitle="Official roster + ad hoc reporting">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs text-slate-700">
            Program
            <select className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" disabled>
              <option>Standby</option>
              <option>Extra Service (ES)</option>
              <option>PESP</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-700">
            Mode
            <select className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" disabled>
              <option>Official roster mode</option>
              <option>Ad hoc reporting mode</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-700">
            Source Dataset
            <select className="rounded-md border border-slate-300 px-2 py-1.5 text-sm" disabled>
              <option>Current-Year Database</option>
              <option>All Data / Master Database</option>
              <option>Contacts</option>
              <option>Facility Roster Data</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-700">
            Saved Definition
            <input
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Select saved report"
              readOnly
            />
          </label>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Filters">
          <div className="grid gap-2 md:grid-cols-2">
            {filterFields.map((field) => (
              <div
                key={field}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600"
              >
                {field}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Columns / Group / Sort">
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
            <li>Column chooser with workbook mapping presets.</li>
            <li>Sort order controls for official and ad hoc templates.</li>
            <li>Grouping keys with subtotal sections where relevant.</li>
            <li>Template save/load for repeatable reporting workflows.</li>
          </ul>
        </Card>
      </div>

      <Card title="Run / Export">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
            Run Report
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Save Definition
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Export PDF
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Export Excel
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            Print
          </button>
        </div>
      </Card>
    </div>
  );
}
