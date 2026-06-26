import { getMacroIndicators } from "@/services/bcb";
import { NextResponse } from "next/server";

export async function GET() {
  const indicators = await getMacroIndicators();
  return NextResponse.json(indicators);
}
