import { ProgramConfig, WorkbookSectionKey } from "@/types/payroll";
import { ProgramTabs } from "@/components/program/program-tabs";
import { Card } from "@/components/ui/card";

type ProgramPageHeaderProps = {
  program: ProgramConfig;
  section: WorkbookSectionKey;
};

export function ProgramPageHeader({ program, section }: ProgramPageHeaderProps) {
  const activeTab = program.tabs.find((tab) => tab.key === section);

  return (
    <Card
      title={`${program.name} - ${activeTab?.label ?? "Program Section"}`}
      subtitle={activeTab?.description ?? "Workbook-aligned section"}
    >
      <ProgramTabs program={program} activeSection={section} />
    </Card>
  );
}
