import Link from "next/link";
import { PROGRAM_CONFIGS } from "@/lib/payroll/program-config";
import { ProgramSlug } from "@/types/payroll";

type TopbarProps = {
  title: string;
  subtitle?: string;
  activeProgram?: ProgramSlug;
  breadcrumbs?: string[];
};

export function Topbar({
  title,
  subtitle,
  activeProgram,
  breadcrumbs,
}: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <p className="mb-0.5 text-xs text-slate-500">{breadcrumbs.join(" / ")}</p>
        )}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {Object.values(PROGRAM_CONFIGS).map((program) => {
          const isActive = activeProgram === program.slug;
          return (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}/home`}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {program.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

