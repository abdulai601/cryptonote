import { PROGRAM_CONFIGS } from "@/lib/payroll/program-config";
import { ProgramConfig, ProgramSlug } from "@/types/payroll";

export const PROGRAM_SLUGS: ProgramSlug[] = ["standby", "es", "pesp"];

export function isProgramSlug(value: string): value is ProgramSlug {
  return PROGRAM_SLUGS.includes(value as ProgramSlug);
}

export function resolveProgramConfig(value: string): ProgramConfig | null {
  if (!isProgramSlug(value)) {
    return null;
  }

  return PROGRAM_CONFIGS[value];
}
