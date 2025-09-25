'use server';
/**
 * @fileOverview A backtesting engine for trading strategies.
 *
 * - backtestStrategy - A function that simulates a trading strategy over historical data.
 * - BacktestStrategyInput - The input type for the backtestStrategy function.
 * - BacktestStrategyOutput - The return type for the backtestStrategy function.
 */

import { getAI } from '@/ai/genkit';
import {z} from 'genkit';

const ai = getAI();

const BacktestStrategyInputSchema = z.object({
  strategy: z
    .string()
    .describe('The trading strategy to be backtested. E.g., "Buy when RSI is below 30 and sell when it is above 70."'),
  ticker: z.string().describe('The stock ticker symbol to run the backtest on. E.g., "PETR4".'),
  startDate: z.string().describe('The start date for the backtest period in ISO format. E.g., "2023-01-01".'),
  endDate: z.string().describe('The end date for the backtest period in ISO format. E.g., "2024-01-01".'),
});
export type BacktestStrategyInput = z.infer<typeof BacktestStrategyInputSchema>;

const TradeSchema = z.object({
    type: z.enum(['buy', 'sell']).describe('The type of trade.'),
    date: z.string().describe('The date of the trade.'),
    price: z.number().describe('The price at which the trade was executed.'),
    shares: z.number().describe('The number of shares traded.'),
    balance: z.number().describe('The account balance after the trade.'),
    reason: z.string().describe('The reason for executing the trade based on the strategy.'),
});

const BacktestStrategyOutputSchema = z.object({
  summary: z.object({
    initialBalance: z.number().describe('The initial balance.'),
    finalBalance: z.number().describe('The final balance after the simulation.'),
    totalProfit: z.number().describe('The total profit or loss.'),
    totalTrades: z.number().describe('The total number of trades executed.'),
    winRate: z.number().describe('The percentage of profitable trades.'),
  }),
  trades: z.array(TradeSchema).describe('A list of all trades executed during the backtest.'),
});
export type BacktestStrategyOutput = z.infer<typeof BacktestStrategyOutputSchema>;


export async function backtestStrategy(
  input: BacktestStrategyInput
): Promise<BacktestStrategyOutput> {
  return backtestStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'backtestStrategyPrompt',
  input: {schema: BacktestStrategyInputSchema},
  output: {schema: BacktestStrategyOutputSchema},
  prompt: `Você é uma IA analista financeira sofisticada. Sua tarefa é simular o desempenho de uma determinada estratégia de negociação em uma ação específica durante um período histórico definido.

Você receberá uma estratégia, um código de ação, uma data de início e uma data de término. Assuma um saldo inicial de R$10.000.

Com base na estratégia fornecida, você deve gerar uma série plausível de negociações de compra e venda. Para cada negociação, você deve fornecer a data, o preço, o número de ações, o saldo da conta resultante e uma breve justificativa com base nas regras da estratégia. Os preços devem refletir um histórico de preços realista (mas fictício) para o código de ação fornecido.

Após gerar as negociações, você deve calcular os resultados finais da simulação, incluindo o saldo final, o lucro/perda total, o número total de negociações e a taxa de vitórias.

**Estratégia:** {{{strategy}}}
**Ativo:** {{{ticker}}}
**Período:** De {{{startDate}}} a {{{endDate}}}

Gere os resultados do backtesting com base nessas informações.`,
});

const backtestStrategyFlow = ai.defineFlow(
  {
    name: 'backtestStrategyFlow',
    inputSchema: BacktestStrategyInputSchema,
    outputSchema: BacktestStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
