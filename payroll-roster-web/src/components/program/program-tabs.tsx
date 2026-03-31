import Link from "next/link";
import { ProgramConfig, WorkbookSectionKey } from "@/types/payroll";

type ProgramTabsProps = {
  program: ProgramConfig;
  activeSection: WorkbookSectionKey;
};

export function ProgramTabs({ program, activeSection }: ProgramTabsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {program.tabs.map((tab) => {
        const isActive = tab.key === activeSection;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              isActive
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

