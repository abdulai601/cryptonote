import { NextResponse } from "next/server";
import { reportRunSchema, runReport } from "@/lib/payroll/services/report-service";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = reportRunSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await runReport(parsed.data);
  return NextResponse.json(result);
}
