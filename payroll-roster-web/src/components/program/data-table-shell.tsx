import { Card } from "@/components/ui/card";

type DataTableShellProps = {
  title: string;
  description: string;
};

export function DataTableShell({ title, description }: DataTableShellProps) {
  return (
    <Card title={title} subtitle={description}>
      <div className="mb-3 grid gap-2 md:grid-cols-4">
        <input
          className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
          placeholder="Search employee"
          readOnly
        />
        <input
          className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
          placeholder="Filter status"
          readOnly
        />
        <input
          className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
          placeholder="Filter facility"
          readOnly
        />
        <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
          Add Record
        </button>
      </div>

      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
        Dataset grid shell. This section will provide inline edit/add/remove actions with audit
        logging and role-based access checks.
      </div>
    </Card>
  );
}
