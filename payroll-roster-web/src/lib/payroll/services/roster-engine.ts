import { ProgramConfig } from "@/types/payroll";

type GenerateMonthlyRosterParams = {
  program: ProgramConfig;
  controlNumber: string;
  includeActive: boolean;
};

type GenerateFacilityRosterParams = {
  program: ProgramConfig;
  facilityCode: string;
};

export type GeneratedRosterResult = {
  metadata: {
    generatedAt: string;
    program: string;
    sourceWorkbook: string;
  };
  sections: {
    additions: Array<Record<string, unknown>>;
    changes: Array<Record<string, unknown>>;
    deletions: Array<Record<string, unknown>>;
    active: Array<Record<string, unknown>>;
  };
};

export type GeneratedFacilityRosterResult = {
  metadata: {
    generatedAt: string;
    program: string;
    facilityCode: string;
  };
  rows: Array<Record<string, unknown>>;
};

export async function generateMonthlyRoster(
  params: GenerateMonthlyRosterParams,
): Promise<GeneratedRosterResult> {
  // Placeholder engine. Real implementation will:
  // 1) Query ProgramRecord by control number for Add/Change/Delete
  // 2) Apply active rule + dedupe key from config
  // 3) Apply workbook sort order
  // 4) Persist RosterRun and section rows
  const now = new Date().toISOString();

  return {
    metadata: {
      generatedAt: now,
      program: params.program.code,
      sourceWorkbook: `${params.program.sourceWorkbookName} (Control ${params.controlNumber})`,
    },
    sections: {
      additions: [],
      changes: [],
      deletions: [],
      active: params.includeActive ? [] : [],
    },
  };
}

export async function generateFacilityRoster(
  params: GenerateFacilityRosterParams,
): Promise<GeneratedFacilityRosterResult> {
  const now = new Date().toISOString();

  return {
    metadata: {
      generatedAt: now,
      program: params.program.code,
      facilityCode: params.facilityCode,
    },
    rows: [],
  };
}
