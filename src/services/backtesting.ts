'use server';

import { BacktestStrategyOutput, HistoricalPrice } from "@/lib/market-types";
import { getHistoricalPrices } from "@/services/brapi";

export type BacktestStrategyId = "rsi" | "moving-average-cross" | "breakout";

export type BacktestStrategyInput = {
  strategy: BacktestStrategyId;
  ticker: string;
  startDate: string;
  endDate: string;
};

const INITIAL_BALANCE = 10_000;

function movingAverage(values: number[], period: number, index: number) {
  if (index + 1 < period) return null;

  const slice = values.slice(index + 1 - period, index + 1);
  return slice.reduce((sum, value) => sum + value, 0) / period;
}

function calculateRsi(values: number[], period: number, index: number) {
  if (index < period) return null;

  let gains = 0;
  let losses = 0;

  for (let cursor = index - period + 1; cursor <= index; cursor++) {
    const change = values[cursor] - values[cursor - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  if (losses === 0) return 100;

  const relativeStrength = gains / losses;
  return 100 - 100 / (1 + relativeStrength);
}

function inPeriod(price: HistoricalPrice, startDate: string, endDate: string) {
  return price.date >= startDate && price.date <= endDate;
}

function countWinningClosedTrades(trades: BacktestStrategyOutput["trades"]) {
  let lastBuyPrice = 0;
  let winningTrades = 0;
  let closedTrades = 0;

  for (const trade of trades) {
    if (trade.type === "buy") {
      lastBuyPrice = trade.price;
    }

    if (trade.type === "sell" && lastBuyPrice > 0) {
      closedTrades += 1;
      if (trade.price > lastBuyPrice) winningTrades += 1;
      lastBuyPrice = 0;
    }
  }

  return closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;
}

function executeBuy(balance: number, price: number) {
  const shares = Math.floor(balance / price);
  return {
    shares,
    balance: balance - shares * price,
  };
}

export async function backtestStrategy(input: BacktestStrategyInput): Promise<BacktestStrategyOutput> {
  const history = (await getHistoricalPrices(input.ticker, "5y", "1d")).filter((price) =>
    inPeriod(price, input.startDate, input.endDate)
  );

  if (history.length < 30) {
    throw new Error("Histórico insuficiente para executar o backtest no período selecionado.");
  }

  const closes = history.map((price) => price.close);
  const trades: BacktestStrategyOutput["trades"] = [];
  let balance = INITIAL_BALANCE;
  let shares = 0;
  let entryPrice = 0;

  for (let index = 1; index < history.length; index++) {
    const point = history[index];
    const price = point.close;
    let shouldBuy = false;
    let shouldSell = false;
    let reason = "";

    if (input.strategy === "rsi") {
      const rsi = calculateRsi(closes, 14, index);
      shouldBuy = shares === 0 && rsi !== null && rsi < 30;
      shouldSell = shares > 0 && rsi !== null && rsi > 70;
      reason = rsi === null ? "" : `IFR de 14 períodos em ${rsi.toFixed(1)}.`;
    }

    if (input.strategy === "moving-average-cross") {
      const shortAverage = movingAverage(closes, 9, index);
      const longAverage = movingAverage(closes, 21, index);
      const previousShortAverage = movingAverage(closes, 9, index - 1);
      const previousLongAverage = movingAverage(closes, 21, index - 1);

      shouldBuy =
        shares === 0 &&
        shortAverage !== null &&
        longAverage !== null &&
        previousShortAverage !== null &&
        previousLongAverage !== null &&
        previousShortAverage <= previousLongAverage &&
        shortAverage > longAverage;
      shouldSell =
        shares > 0 &&
        shortAverage !== null &&
        longAverage !== null &&
        previousShortAverage !== null &&
        previousLongAverage !== null &&
        previousShortAverage >= previousLongAverage &&
        shortAverage < longAverage;
      reason =
        shortAverage === null || longAverage === null
          ? ""
          : `Média curta ${shortAverage.toFixed(2)} e média longa ${longAverage.toFixed(2)}.`;
    }

    if (input.strategy === "breakout") {
      const previousWindow = closes.slice(Math.max(0, index - 20), index);
      const resistance = Math.max(...previousWindow);
      shouldBuy = shares === 0 && previousWindow.length >= 20 && price > resistance;
      shouldSell = shares > 0 && price <= entryPrice * 0.95;
      reason = previousWindow.length >= 20 ? `Preço comparado à resistência de R$ ${resistance.toFixed(2)}.` : "";
    }

    if (shouldBuy) {
      const order = executeBuy(balance, price);

      if (order.shares > 0) {
        shares = order.shares;
        balance = order.balance;
        entryPrice = price;
        trades.push({
          type: "buy",
          date: point.date,
          price,
          shares,
          balance: balance + shares * price,
          reason: reason || "Sinal de compra acionado pela estratégia.",
        });
      }
    } else if (shouldSell && shares > 0) {
      balance += shares * price;
      trades.push({
        type: "sell",
        date: point.date,
        price,
        shares,
        balance,
        reason: reason || "Sinal de venda acionado pela estratégia.",
      });
      shares = 0;
      entryPrice = 0;
    }
  }

  const lastPrice = history[history.length - 1].close;
  const finalBalance = balance + shares * lastPrice;
  const totalProfit = finalBalance - INITIAL_BALANCE;

  return {
    summary: {
      initialBalance: INITIAL_BALANCE,
      finalBalance,
      totalProfit,
      totalTrades: trades.length,
      winRate: countWinningClosedTrades(trades),
    },
    trades,
  };
}
