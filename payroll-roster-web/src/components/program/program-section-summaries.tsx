import { ProgramConfig } from "@/types/payroll";
import { Card } from "@/components/ui/card";

type ProgramSectionSummariesProps = {
  program: ProgramConfig;
};

export function ProgramSectionSummaries({ program }: ProgramSectionSummariesProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Monthly Field Mapping Snapshot">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-2 py-1">Target Field</th>
                <th className="px-2 py-1">Source Column/Rule</th>
              </tr>
            </thead>
            <tbody>
              {program.monthlyFieldMappings.map((mapping) => (
                <tr key={mapping.targetField} className="border-b border-slate-100">
                  <td className="px-2 py-1 text-slate-700">{mapping.targetField}</td>
                  <td className="px-2 py-1 text-slate-600">
                    {mapping.sourceColumnRef}
                    {mapping.notes ? ` (${mapping.notes})` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Facility + Signature Rules">
        <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
          {program.facilityRosterNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          <li>{program.officialSignature}</li>
          {program.fiscalConstants.defaultReportEndDate && (
            <li>
              Default report end date constant: {program.fiscalConstants.defaultReportEndDate}
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

