export type MarketAssetType = "stock" | "fii" | "etf" | "bdr" | "unknown";

export type MarketQuote = {
  symbol: string;
  name: string;
  currency: string;
  price: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changeValue: number;
  marketCap: number;
  volume: number;
  open: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  priceEarnings?: number;
  earningsPerShare?: number;
  dividendYield?: number;
  sector?: string;
  assetType: MarketAssetType;
  logoUrl?: string;
};

export type HistoricalPrice = {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
};

export type DividendEvent = {
  date: string;
  label: string;
  value: number;
};

export type Opportunity = {
  ticker: string;
  name: string;
  score: number;
  price: number;
  change: number;
  dividendYield?: number;
  priceEarnings?: number;
  reasons: string[];
};

export type BacktestTrade = {
  type: "buy" | "sell";
  date: string;
  price: number;
  shares: number;
  balance: number;
  reason: string;
};

export type BacktestStrategyOutput = {
  summary: {
    initialBalance: number;
    finalBalance: number;
    totalProfit: number;
    totalTrades: number;
    winRate: number;
  };
  trades: BacktestTrade[];
};

export type PortfolioAssetInput = {
  ticker: string;
  quantity: number;
};

export type AnalyzedPortfolioAsset = {
  ticker: string;
  quantity: number;
  price: number;
  totalValue: number;
  allocation: number;
  sector: string;
  assetType: MarketAssetType;
  change: number;
  dividendYield?: number;
};

export type AnalyzePortfolioOutput = {
  totalValue: number;
  assets: AnalyzedPortfolioAsset[];
  recommendation: string;
  diagnostics: string[];
};
