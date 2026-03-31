import { NextResponse } from "next/server";
import { importPreviewSchema, previewImport } from "@/lib/payroll/services/import-service";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = importPreviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await previewImport(parsed.data);
  return NextResponse.json(result);
}
