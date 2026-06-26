'use server';

import { AnalyzePortfolioOutput, PortfolioAssetInput } from "@/lib/market-types";
import { getQuotes } from "@/services/brapi";

function buildDiagnostics(output: AnalyzePortfolioOutput) {
  const diagnostics: string[] = [];
  const largestAsset = [...output.assets].sort((a, b) => b.allocation - a.allocation)[0];
  const sectorExposure = output.assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.sector] = (acc[asset.sector] || 0) + asset.allocation;
    return acc;
  }, {});
  const assetTypeExposure = output.assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.assetType] = (acc[asset.assetType] || 0) + asset.allocation;
    return acc;
  }, {});
  const largestSector = Object.entries(sectorExposure).sort((a, b) => b[1] - a[1])[0];
  const stocksExposure = assetTypeExposure.stock || 0;

  if (largestAsset && largestAsset.allocation > 35) {
    diagnostics.push(`${largestAsset.ticker} representa ${largestAsset.allocation.toFixed(1)}% da carteira; acima de 35% indica concentração relevante.`);
  }

  if (largestSector && largestSector[1] > 50) {
    diagnostics.push(`O setor ${largestSector[0]} concentra ${largestSector[1].toFixed(1)}% da carteira.`);
  }

  if (stocksExposure > 80) {
    diagnostics.push(`A exposição a ações está em ${stocksExposure.toFixed(1)}%; avalie balancear com renda fixa, FIIs ou ETFs conforme seu perfil.`);
  }

  const negativeMomentum = output.assets.filter((asset) => asset.change < -5);
  if (negativeMomentum.length > 0) {
    diagnostics.push(`${negativeMomentum.map((asset) => asset.ticker).join(", ")} caiu mais de 5% no dia; vale revisar risco e tamanho da posição.`);
  }

  const dividendAssets = output.assets.filter((asset) => (asset.dividendYield || 0) > 6);
  if (dividendAssets.length > 0) {
    diagnostics.push(`${dividendAssets.map((asset) => asset.ticker).join(", ")} tem dividend yield elevado; confirme consistência de lucro e recorrência dos proventos.`);
  }

  if (diagnostics.length === 0) {
    diagnostics.push("A carteira não apresenta concentração extrema pelas regras atuais.");
  }

  return diagnostics;
}

function buildRecommendation(diagnostics: string[]) {
  return diagnostics.join(" ");
}

export async function analyzePortfolio(input: { assets: PortfolioAssetInput[] }): Promise<AnalyzePortfolioOutput> {
  const validAssets = input.assets.filter((asset) => asset.ticker && asset.quantity > 0);

  if (validAssets.length === 0) {
    return {
      totalValue: 0,
      assets: [],
      diagnostics: ["Adicione ativos e quantidades positivas para iniciar a análise."],
      recommendation: "Adicione ativos e quantidades positivas para iniciar a análise.",
    };
  }

  const quotes = await getQuotes(validAssets.map((asset) => asset.ticker));
  const quoteByTicker = new Map(quotes.map((quote) => [quote.symbol, quote]));
  const analyzedAssets = validAssets
    .map((asset) => {
      const quote = quoteByTicker.get(asset.ticker.toUpperCase());

      if (!quote) return null;

      return {
        ticker: quote.symbol,
        quantity: asset.quantity,
        price: quote.price,
        totalValue: asset.quantity * quote.price,
        allocation: 0,
        sector: quote.sector || "Não classificado",
        assetType: quote.assetType,
        change: quote.change,
        dividendYield: quote.dividendYield,
      };
    })
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  const totalValue = analyzedAssets.reduce((sum, asset) => sum + asset.totalValue, 0);
  const assets = analyzedAssets.map((asset) => ({
    ...asset,
    allocation: totalValue > 0 ? (asset.totalValue / totalValue) * 100 : 0,
  }));
  const output: AnalyzePortfolioOutput = {
    totalValue,
    assets,
    diagnostics: [],
    recommendation: "",
  };
  const diagnostics = buildDiagnostics(output);

  return {
    ...output,
    diagnostics,
    recommendation: buildRecommendation(diagnostics),
  };
}
