import { getQuote } from "@/services/brapi";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const quote = await getQuote(ticker);

  if (!quote) {
    return NextResponse.json({ error: "Cotação não encontrada." }, { status: 404 });
  }

  return NextResponse.json(quote);
}
