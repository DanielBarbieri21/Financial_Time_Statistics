export const DEFAULT_TICKERS = [
  "PETR4",
  "VALE3",
  "ITUB4",
  "BBDC4",
  "BBAS3",
  "B3SA3",
  "ELET3",
  "WEGE3",
  "ABEV3",
  "SUZB3",
  "MGLU3",
  "RENT3",
];

export const DEFAULT_TICKER_OPTIONS = DEFAULT_TICKERS.map((ticker) => ({
  value: ticker,
  label: ticker,
}));
