import { ProgramCode, DatasetType } from "@prisma/client";
import { z } from "zod";

export const importPreviewSchema = z.object({
  program: z.enum(["STANDBY", "ES", "PESP"]),
  datasetType: z.enum(["CURRENT_YEAR", "MASTER"]),
  fileName: z.string().min(1),
  rowCount: z.number().int().nonnegative(),
});

export type ImportPreviewInput = z.infer<typeof importPreviewSchema>;

export type ImportPreviewResult = {
  metadata: {
    previewAt: string;
    program: ProgramCode;
    datasetType: DatasetType;
    fileName: string;
  };
  validation: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    duplicateRows: number;
  };
  samples: Array<Record<string, unknown>>;
};

export async function previewImport(input: ImportPreviewInput): Promise<ImportPreviewResult> {
  // Placeholder for XLSX parse + staging + validation behavior.
  return {
    metadata: {
      previewAt: new Date().toISOString(),
      program: input.program,
      datasetType: input.datasetType,
      fileName: input.fileName,
    },
    validation: {
      totalRows: input.rowCount,
      validRows: 0,
      invalidRows: 0,
      duplicateRows: 0,
    },
    samples: [],
  };
}
