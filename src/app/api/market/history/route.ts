import { getHistoricalPricesForTickers } from "@/services/brapi";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tickers = (searchParams.get("tickers") || "")
    .split(",")
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean);
  const range = searchParams.get("range") || "1y";
  const interval = searchParams.get("interval") || "1d";

  if (tickers.length === 0) {
    return NextResponse.json({ error: "Informe ao menos um ativo." }, { status: 400 });
  }

  const data = await getHistoricalPricesForTickers(tickers, range, interval);
  return NextResponse.json(data);
}
