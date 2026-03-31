import { DatasetType, ProgramCode } from "@prisma/client";
import { z } from "zod";

export const reportRunSchema = z.object({
  program: z.enum(["STANDBY", "ES", "PESP"]),
  mode: z.enum(["OFFICIAL", "AD_HOC"]),
  sourceDataset: z.enum(["CURRENT_YEAR", "MASTER", "CONTACTS", "FACILITY"]),
  filters: z.array(
    z.object({
      field: z.string().min(1),
      operator: z.string().min(1),
      value: z.string().optional(),
    }),
  ),
  columns: z.array(z.string().min(1)),
  sort: z.array(
    z.object({
      field: z.string().min(1),
      direction: z.enum(["asc", "desc"]),
    }),
  ),
  group: z.array(z.string().min(1)).optional(),
});

export type ReportRunInput = z.infer<typeof reportRunSchema>;

export type ReportRunResult = {
  metadata: {
    runAt: string;
    program: ProgramCode;
    dataset: DatasetType;
    mode: "OFFICIAL" | "AD_HOC";
  };
  rows: Array<Record<string, unknown>>;
};

export async function runReport(input: ReportRunInput): Promise<ReportRunResult> {
  // Placeholder shell for query-planner implementation.
  return {
    metadata: {
      runAt: new Date().toISOString(),
      program: input.program,
      dataset: input.sourceDataset,
      mode: input.mode,
    },
    rows: [],
  };
}
