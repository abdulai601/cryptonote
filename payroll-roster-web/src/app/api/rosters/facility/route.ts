import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveProgramConfig } from "@/lib/payroll/program-resolver";
import { generateFacilityRoster } from "@/lib/payroll/services/roster-engine";

const requestSchema = z.object({
  program: z.enum(["standby", "es", "pesp"]),
  facilityCode: z.string().min(1),
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

  const result = await generateFacilityRoster({
    program,
    facilityCode: parsed.data.facilityCode,
  });

  return NextResponse.json(result);
}
