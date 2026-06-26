'use server';

import {
  DividendEvent,
  HistoricalPrice,
  MarketAssetType,
  MarketQuote,
  Opportunity,
} from "@/lib/market-types";
import { DEFAULT_TICKERS } from "@/services/market-data";

type BrapiHistoricalPrice = {
  date?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

type BrapiCashDividend = {
  assetIssued?: string;
  paymentDate?: string;
  rate?: number;
  relatedTo?: string;
  approvedOn?: string;
};

type BrapiQuoteResponse = {
  symbol: string;
  shortName?: string;
  longName?: string;
  currency?: string;
  regularMarketPrice?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  marketCap?: number;
  regularMarketVolume?: number;
  regularMarketOpen?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  priceEarnings?: number;
  earningsPerShare?: number;
  dividendYield?: number;
  sector?: string;
  stockType?: string;
  type?: string;
  logourl?: string;
  historicalDataPrice?: BrapiHistoricalPrice[];
  dividendsData?: {
    cashDividends?: BrapiCashDividend[];
  };
};

let hasWarnedMissingBrapiKey = false;

const demoQuotes: Record<string, BrapiQuoteResponse> = {
  PETR4: {
    symbol: "PETR4",
    shortName: "Petrobras PN",
    longName: "Petrobras PN",
    currency: "BRL",
    regularMarketPrice: 38.42,
    regularMarketDayHigh: 39.1,
    regularMarketDayLow: 37.86,
    regularMarketChange: 0.51,
    regularMarketChangePercent: 1.35,
    marketCap: 492_000_000_000,
    regularMarketVolume: 42_500_000,
    regularMarketOpen: 37.91,
    fiftyTwoWeekHigh: 42.8,
    fiftyTwoWeekLow: 29.7,
    priceEarnings: 5.8,
    earningsPerShare: 6.62,
    dividendYield: 10.4,
    sector: "Petróleo, Gás e Biocombustíveis",
  },
  VALE3: {
    symbol: "VALE3",
    shortName: "Vale ON",
    longName: "Vale ON",
    currency: "BRL",
    regularMarketPrice: 61.75,
    regularMarketDayHigh: 62.4,
    regularMarketDayLow: 60.6,
    regularMarketChange: -0.62,
    regularMarketChangePercent: -0.99,
    marketCap: 278_000_000_000,
    regularMarketVolume: 28_700_000,
    regularMarketOpen: 62.2,
    fiftyTwoWeekHigh: 74.2,
    fiftyTwoWeekLow: 52.4,
    priceEarnings: 7.4,
    earningsPerShare: 8.34,
    dividendYield: 7.8,
    sector: "Materiais Básicos",
  },
  ITUB4: {
    symbol: "ITUB4",
    shortName: "Itaú Unibanco PN",
    longName: "Itaú Unibanco PN",
    currency: "BRL",
    regularMarketPrice: 34.28,
    regularMarketDayHigh: 34.71,
    regularMarketDayLow: 33.92,
    regularMarketChange: 0.23,
    regularMarketChangePercent: 0.68,
    marketCap: 334_000_000_000,
    regularMarketVolume: 21_100_000,
    regularMarketOpen: 34.01,
    fiftyTwoWeekHigh: 36.9,
    fiftyTwoWeekLow: 27.8,
    priceEarnings: 8.9,
    earningsPerShare: 3.85,
    dividendYield: 6.2,
    sector: "Financeiro",
  },
  BBDC4: {
    symbol: "BBDC4",
    shortName: "Bradesco PN",
    longName: "Bradesco PN",
    currency: "BRL",
    regularMarketPrice: 13.22,
    regularMarketDayHigh: 13.45,
    regularMarketDayLow: 12.98,
    regularMarketChange: -0.08,
    regularMarketChangePercent: -0.6,
    marketCap: 141_000_000_000,
    regularMarketVolume: 18_900_000,
    regularMarketOpen: 13.28,
    fiftyTwoWeekHigh: 16.2,
    fiftyTwoWeekLow: 11.9,
    priceEarnings: 9.7,
    earningsPerShare: 1.36,
    dividendYield: 5.1,
    sector: "Financeiro",
  },
  BBAS3: {
    symbol: "BBAS3",
    shortName: "Banco do Brasil ON",
    longName: "Banco do Brasil ON",
    currency: "BRL",
    regularMarketPrice: 28.64,
    regularMarketDayHigh: 29.02,
    regularMarketDayLow: 28.22,
    regularMarketChange: 0.44,
    regularMarketChangePercent: 1.56,
    marketCap: 164_000_000_000,
    regularMarketVolume: 15_600_000,
    regularMarketOpen: 28.2,
    fiftyTwoWeekHigh: 31.7,
    fiftyTwoWeekLow: 23.1,
    priceEarnings: 4.6,
    earningsPerShare: 6.23,
    dividendYield: 8.9,
    sector: "Financeiro",
  },
  B3SA3: {
    symbol: "B3SA3",
    shortName: "B3 ON",
    longName: "B3 ON",
    currency: "BRL",
    regularMarketPrice: 11.18,
    regularMarketDayHigh: 11.41,
    regularMarketDayLow: 10.96,
    regularMarketChange: 0.16,
    regularMarketChangePercent: 1.45,
    marketCap: 61_000_000_000,
    regularMarketVolume: 24_400_000,
    regularMarketOpen: 11.02,
    fiftyTwoWeekHigh: 14.1,
    fiftyTwoWeekLow: 9.7,
    priceEarnings: 15.2,
    earningsPerShare: 0.74,
    dividendYield: 4.1,
    sector: "Financeiro",
  },
  ELET3: {
    symbol: "ELET3",
    shortName: "Eletrobras ON",
    longName: "Eletrobras ON",
    currency: "BRL",
    regularMarketPrice: 39.86,
    regularMarketDayHigh: 40.22,
    regularMarketDayLow: 39.18,
    regularMarketChange: 0.3,
    regularMarketChangePercent: 0.76,
    marketCap: 91_000_000_000,
    regularMarketVolume: 7_900_000,
    regularMarketOpen: 39.56,
    fiftyTwoWeekHigh: 45.6,
    fiftyTwoWeekLow: 33.4,
    priceEarnings: 12.1,
    earningsPerShare: 3.29,
    dividendYield: 3.7,
    sector: "Energia Elétrica",
  },
  WEGE3: {
    symbol: "WEGE3",
    shortName: "WEG ON",
    longName: "WEG ON",
    currency: "BRL",
    regularMarketPrice: 42.75,
    regularMarketDayHigh: 43.1,
    regularMarketDayLow: 42.02,
    regularMarketChange: 0.71,
    regularMarketChangePercent: 1.69,
    marketCap: 179_000_000_000,
    regularMarketVolume: 5_800_000,
    regularMarketOpen: 42.04,
    fiftyTwoWeekHigh: 46.2,
    fiftyTwoWeekLow: 32.8,
    priceEarnings: 31.4,
    earningsPerShare: 1.36,
    dividendYield: 1.9,
    sector: "Bens Industriais",
  },
  ABEV3: {
    symbol: "ABEV3",
    shortName: "Ambev ON",
    longName: "Ambev ON",
    currency: "BRL",
    regularMarketPrice: 12.04,
    regularMarketDayHigh: 12.18,
    regularMarketDayLow: 11.91,
    regularMarketChange: -0.04,
    regularMarketChangePercent: -0.33,
    marketCap: 189_000_000_000,
    regularMarketVolume: 13_300_000,
    regularMarketOpen: 12.08,
    fiftyTwoWeekHigh: 14.3,
    fiftyTwoWeekLow: 10.7,
    priceEarnings: 14.8,
    earningsPerShare: 0.81,
    dividendYield: 5.5,
    sector: "Consumo não Cíclico",
  },
  SUZB3: {
    symbol: "SUZB3",
    shortName: "Suzano ON",
    longName: "Suzano ON",
    currency: "BRL",
    regularMarketPrice: 53.16,
    regularMarketDayHigh: 54.02,
    regularMarketDayLow: 52.48,
    regularMarketChange: -0.29,
    regularMarketChangePercent: -0.54,
    marketCap: 70_000_000_000,
    regularMarketVolume: 4_900_000,
    regularMarketOpen: 53.45,
    fiftyTwoWeekHigh: 62.1,
    fiftyTwoWeekLow: 43.2,
    priceEarnings: 11.3,
    earningsPerShare: 4.7,
    dividendYield: 2.8,
    sector: "Materiais Básicos",
  },
  MGLU3: {
    symbol: "MGLU3",
    shortName: "Magazine Luiza ON",
    longName: "Magazine Luiza ON",
    currency: "BRL",
    regularMarketPrice: 8.92,
    regularMarketDayHigh: 9.31,
    regularMarketDayLow: 8.71,
    regularMarketChange: 0.28,
    regularMarketChangePercent: 3.24,
    marketCap: 6_200_000_000,
    regularMarketVolume: 32_100_000,
    regularMarketOpen: 8.64,
    fiftyTwoWeekHigh: 12.5,
    fiftyTwoWeekLow: 5.8,
    priceEarnings: 22.5,
    earningsPerShare: 0.4,
    dividendYield: 0.2,
    sector: "Consumo Cíclico",
  },
  RENT3: {
    symbol: "RENT3",
    shortName: "Localiza ON",
    longName: "Localiza ON",
    currency: "BRL",
    regularMarketPrice: 46.82,
    regularMarketDayHigh: 47.5,
    regularMarketDayLow: 45.94,
    regularMarketChange: -0.76,
    regularMarketChangePercent: -1.6,
    marketCap: 50_000_000_000,
    regularMarketVolume: 6_700_000,
    regularMarketOpen: 47.45,
    fiftyTwoWeekHigh: 66.4,
    fiftyTwoWeekLow: 38.9,
    priceEarnings: 19.1,
    earningsPerShare: 2.45,
    dividendYield: 1.1,
    sector: "Consumo Cíclico",
  },
};

function getRangeDays(range?: string) {
  const ranges: Record<string, number> = {
    "5d": 5,
    "1mo": 30,
    "3mo": 90,
    "6mo": 180,
    "1y": 365,
    "5y": 365 * 5,
  };

  return ranges[range || "1y"] || 365;
}

function generateDemoHistory(ticker: string, range?: string): BrapiHistoricalPrice[] {
  const quote = demoQuotes[ticker] || demoQuotes.PETR4;
  const days = getRangeDays(range);
  const points = Math.min(days, 520);
  const basePrice = quote.regularMarketPrice || 25;
  const seed = ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - points);

  return Array.from({ length: points }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const trend = 1 + (index - points / 2) / points * 0.18;
    const cycle = Math.sin((index + seed) / 13) * 0.045;
    const shorterCycle = Math.cos((index + seed) / 5) * 0.018;
    const close = Number((basePrice * trend * (1 + cycle + shorterCycle)).toFixed(2));
    const open = Number((close * (1 + Math.sin(index + seed) * 0.006)).toFixed(2));
    const high = Number((Math.max(open, close) * 1.012).toFixed(2));
    const low = Number((Math.min(open, close) * 0.988).toFixed(2));

    return {
      date: Math.floor(date.getTime() / 1000),
      open,
      high,
      low,
      close,
      volume: Math.round((quote.regularMarketVolume || 5_000_000) * (0.75 + (index % 10) / 30)),
    };
  });
}

function getDemoQuoteResponses(
  tickers: string[],
  options?: { range?: string; interval?: string; fundamental?: boolean; dividends?: boolean }
): BrapiQuoteResponse[] {
  return tickers
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean)
    .map((ticker) => {
      const quote = demoQuotes[ticker] || {
        ...demoQuotes.PETR4,
        symbol: ticker,
        shortName: ticker,
        longName: `${ticker} (demonstração)`,
      };

      return {
        ...quote,
        historicalDataPrice: options?.range ? generateDemoHistory(ticker, options.range) : undefined,
        dividendsData: options?.dividends
          ? {
              cashDividends: [
                {
                  paymentDate: "2026-05-15",
                  rate: Number(((quote.regularMarketPrice || 20) * 0.012).toFixed(2)),
                  relatedTo: "Dividendo demonstrativo",
                },
                {
                  paymentDate: "2026-02-15",
                  rate: Number(((quote.regularMarketPrice || 20) * 0.009).toFixed(2)),
                  relatedTo: "JCP demonstrativo",
                },
              ],
            }
          : undefined,
      };
    });
}

function getApiKeyParam() {
  return process.env.BRAPI_API_KEY ? `&token=${process.env.BRAPI_API_KEY}` : "";
}

function detectAssetType(data: BrapiQuoteResponse): MarketAssetType {
  const rawType = `${data.stockType || ""} ${data.type || ""} ${data.symbol || ""}`.toLowerCase();

  if (rawType.includes("fii") || rawType.endsWith("11")) return "fii";
  if (rawType.includes("etf")) return "etf";
  if (rawType.includes("bdr")) return "bdr";
  if (data.symbol) return "stock";

  return "unknown";
}

function mapQuoteData(data: BrapiQuoteResponse): MarketQuote {
  return {
    symbol: data.symbol,
    name: data.longName || data.shortName || data.symbol,
    currency: data.currency || "BRL",
    price: data.regularMarketPrice || 0,
    dayHigh: data.regularMarketDayHigh || 0,
    dayLow: data.regularMarketDayLow || 0,
    change: data.regularMarketChangePercent || 0,
    changeValue: data.regularMarketChange || 0,
    marketCap: data.marketCap || 0,
    volume: data.regularMarketVolume || 0,
    open: data.regularMarketOpen || 0,
    fiftyTwoWeekHigh: data.fiftyTwoWeekHigh || 0,
    fiftyTwoWeekLow: data.fiftyTwoWeekLow || 0,
    priceEarnings: data.priceEarnings,
    earningsPerShare: data.earningsPerShare,
    dividendYield: data.dividendYield,
    sector: data.sector || "Não classificado",
    assetType: detectAssetType(data),
    logoUrl: data.logourl,
  };
}

function mapHistoricalData(data?: BrapiHistoricalPrice[]): HistoricalPrice[] {
  return (data || [])
    .filter((item) => item.date && typeof item.close === "number")
    .map((item) => ({
      date: new Date(Number(item.date) * 1000).toISOString().split("T")[0],
      close: Number(item.close),
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mapDividends(data?: BrapiCashDividend[]): DividendEvent[] {
  return (data || [])
    .filter((item) => item.paymentDate && typeof item.rate === "number")
    .map((item) => ({
      date: item.paymentDate!,
      label: item.relatedTo || item.assetIssued || "Provento",
      value: Number(item.rate),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

async function fetchBrapiQuote(
  tickers: string[],
  options?: { range?: string; interval?: string; fundamental?: boolean; dividends?: boolean }
): Promise<BrapiQuoteResponse[]> {
  if (!process.env.BRAPI_API_KEY) {
    if (!hasWarnedMissingBrapiKey) {
      console.warn("BRAPI_API_KEY não configurada. Usando dados demonstrativos locais.");
      hasWarnedMissingBrapiKey = true;
    }

    return getDemoQuoteResponses(tickers, options);
  }

  const tickerParam = tickers.map((ticker) => ticker.trim().toUpperCase()).filter(Boolean).join(",");
  const params = new URLSearchParams();

  if (options?.range) params.set("range", options.range);
  if (options?.interval) params.set("interval", options.interval);
  if (options?.fundamental) params.set("fundamental", "true");
  if (options?.dividends) params.set("dividends", "true");

  const query = params.toString();
  const url = `https://brapi.dev/api/quote/${tickerParam}?${query}${getApiKeyParam()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      console.error(`Erro ao buscar dados na Brapi: ${response.status} ${response.statusText}`);
      return getDemoQuoteResponses(tickers, options);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar dados na Brapi:", error);
    return getDemoQuoteResponses(tickers, options);
  }
}

export async function getQuote(ticker: string): Promise<MarketQuote | null> {
  const [quote] = await getQuotes([ticker]);
  return quote || null;
}

export async function getQuotes(tickers: string[]): Promise<MarketQuote[]> {
  const data = await fetchBrapiQuote(tickers, { fundamental: true, dividends: true });
  return data.map(mapQuoteData).filter((quote) => quote.price > 0);
}

export async function getHistoricalPrices(
  ticker: string,
  range = "1y",
  interval = "1d"
): Promise<HistoricalPrice[]> {
  const [data] = await fetchBrapiQuote([ticker], { range, interval });
  return mapHistoricalData(data?.historicalDataPrice);
}

export async function getHistoricalPricesForTickers(
  tickers: string[],
  range = "1y",
  interval = "1d"
): Promise<Record<string, HistoricalPrice[]>> {
  const data = await fetchBrapiQuote(tickers, { range, interval });

  return data.reduce<Record<string, HistoricalPrice[]>>((acc, item) => {
    acc[item.symbol] = mapHistoricalData(item.historicalDataPrice);
    return acc;
  }, {});
}

export async function getDividends(ticker: string): Promise<DividendEvent[]> {
  const [data] = await fetchBrapiQuote([ticker], { dividends: true });
  return mapDividends(data?.dividendsData?.cashDividends);
}

export async function getMarketMovers(limit = 5) {
  const quotes = await getQuotes(DEFAULT_TICKERS);
  const ordered = [...quotes].sort((a, b) => b.change - a.change);

  return {
    gainers: ordered.slice(0, limit),
    losers: ordered.slice(-limit).reverse(),
  };
}

function calculateOpportunityScore(quote: MarketQuote, history: HistoricalPrice[]): Opportunity {
  const first = history[0]?.close || quote.open || quote.price;
  const last = history[history.length - 1]?.close || quote.price;
  const momentum = first > 0 ? ((last - first) / first) * 100 : quote.change;
  const drawdown = quote.fiftyTwoWeekHigh > 0 ? ((quote.price - quote.fiftyTwoWeekHigh) / quote.fiftyTwoWeekHigh) * 100 : 0;
  const liquidityScore = Math.min(25, quote.volume / 1_000_000);
  const momentumScore = Math.max(0, Math.min(25, momentum + 12));
  const valuationScore = quote.priceEarnings && quote.priceEarnings > 0 ? Math.max(0, Math.min(20, 20 - quote.priceEarnings / 2)) : 8;
  const dividendScore = Math.max(0, Math.min(20, (quote.dividendYield || 0) * 2));
  const riskScore = Math.max(0, Math.min(10, 10 + drawdown / 8));
  const score = Math.round(liquidityScore + momentumScore + valuationScore + dividendScore + riskScore);
  const reasons = [
    `Momentum ${momentum >= 0 ? "positivo" : "negativo"} em ${momentum.toFixed(1)}% no período.`,
    `Liquidez diária observada de ${quote.volume.toLocaleString("pt-BR")} negócios/volume reportado.`,
  ];

  if (quote.dividendYield) reasons.push(`Dividend yield informado de ${quote.dividendYield.toFixed(2)}%.`);
  if (quote.priceEarnings) reasons.push(`P/L informado de ${quote.priceEarnings.toFixed(2)}.`);
  if (drawdown < -20) reasons.push(`Ativo ainda distante da máxima de 52 semanas.`);

  return {
    ticker: quote.symbol,
    name: quote.name,
    score,
    price: quote.price,
    change: quote.change,
    dividendYield: quote.dividendYield,
    priceEarnings: quote.priceEarnings,
    reasons,
  };
}

export async function getQuantitativeOpportunities(limit = 4): Promise<Opportunity[]> {
  const quotes = await getQuotes(DEFAULT_TICKERS);
  const histories = await getHistoricalPricesForTickers(
    quotes.map((quote) => quote.symbol),
    "3mo",
    "1d"
  );

  return quotes
    .map((quote) => calculateOpportunityScore(quote, histories[quote.symbol] || []))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
