import Link from "next/link";
import { ProgramSlug } from "@/types/payroll";
import { PROGRAM_CONFIGS } from "@/lib/payroll/program-config";

type SidebarProps = {
  activeProgram?: ProgramSlug;
};

const baseLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Report Builder" },
];

export function Sidebar({ activeProgram }: SidebarProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 px-4 py-4">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          OMH Payroll Roster
        </h1>
        <p className="mt-1 text-xs text-slate-400">Internal Workforce Reporting</p>
      </div>

      <nav className="space-y-1 p-3">
        {baseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Programs
        </p>
        <div className="space-y-3">
          {Object.values(PROGRAM_CONFIGS).map((program) => (
            <div key={program.slug} className="space-y-1">
              <Link
                href={`/programs/${program.slug}/home`}
                className={`block rounded-md px-3 py-2 text-sm ${
                  activeProgram === program.slug
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                {program.name}
              </Link>
              <div className="pl-3">
                {program.tabs.slice(1).map((tab) => (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className="block rounded-md px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

