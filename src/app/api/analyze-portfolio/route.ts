import { analyzePortfolio, type AnalyzePortfolioInput } from "@/ai/flows/analyze-portfolio-flow";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: AnalyzePortfolioInput = await req.json();

    if (!body || !body.assets) {
        return NextResponse.json({ error: "Requisição inválida. A lista de ativos é obrigatória." }, { status: 400 });
    }

    const result = await analyzePortfolio(body);

    return NextResponse.json(result);

  } catch (e: any) {
    console.error("Erro na API analyze-portfolio:", e);
    return NextResponse.json({ error: e.message || "Ocorreu um erro no servidor." }, { status: 500 });
  }
}
