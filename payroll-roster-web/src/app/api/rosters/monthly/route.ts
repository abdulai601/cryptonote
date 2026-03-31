import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";
import { generateMonthlyRoster } from "@/lib/payroll/services/roster-engine";

const requestSchema = z.object({
  program: z.enum(["standby", "es", "pesp"]),
  controlNumber: z.string().min(1),
  includeActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const program = resolveProgramConfig(parsed.data.program);
  if (!program) {
    return NextResponse.json({ error: "Unknown program" }, { status: 404 });
  }

  const result = await generateMonthlyRoster({
    program,
    controlNumber: parsed.data.controlNumber,
    includeActive: parsed.data.includeActive,
  });

  return NextResponse.json(result);
}
