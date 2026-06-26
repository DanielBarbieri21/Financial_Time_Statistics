import { analyzePortfolio } from "@/services/portfolio";
import type { PortfolioAssetInput } from "@/lib/market-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: { assets: PortfolioAssetInput[] } = await req.json();

    if (!body || !body.assets) {
        return NextResponse.json({ error: "Requisição inválida. A lista de ativos é obrigatória." }, { status: 400 });
    }

    const result = await analyzePortfolio(body);

    return NextResponse.json(result);

  } catch (e: unknown) {
    console.error("Erro na API analyze-portfolio:", e);
    const message = e instanceof Error ? e.message : "Ocorreu um erro no servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
