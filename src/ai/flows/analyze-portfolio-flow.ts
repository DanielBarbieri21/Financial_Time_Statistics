'use server';
/**
 * @fileOverview Analyzes a user's stock portfolio.
 *
 * - analyzePortfolio - A function that analyzes a user's stock portfolio.
 * - AnalyzePortfolioInput - The input type for the analyzePortfolio function.
 * - AnalyzePortfolioOutput - The return type for the analyzePortfolio function.
 */

import { getAI } from '@/ai/genkit';
import {z} from 'genkit';

const ai = getAI();

const AssetSchema = z.object({
  ticker: z.string().describe('O código do ativo na bolsa. Ex: "PETR4".'),
  quantity: z.number().positive().describe('A quantidade de ações possuídas.'),
});

const AnalyzePortfolioInputSchema = z.object({
  assets: z.array(AssetSchema).describe('Uma lista de ativos no portfólio.'),
});
export type AnalyzePortfolioInput = z.infer<typeof AnalyzePortfolioInputSchema>;

const AnalyzedAssetSchema = z.object({
    ticker: z.string().describe('O código do ativo na bolsa.'),
    quantity: z.number().describe('A quantidade de ações possuídas.'),
    price: z.number().describe('O preço de mercado fictício atual do ativo.'),
    totalValue: z.number().describe('O valor total de mercado desta posição (quantidade * preço).'),
    allocation: z.number().describe('A alocação percentual deste ativo no portfólio.'),
});

const AnalyzePortfolioOutputSchema = z.object({
  totalValue: z.number().describe('O valor total de mercado de todo o portfólio.'),
  assets: z.array(AnalyzedAssetSchema).describe('Uma lista de todos os ativos no portfólio com sua análise.'),
  recommendation: z.string().describe('Uma breve recomendação ou observação sobre a diversificação e o risco do portfólio.'),
});
export type AnalyzePortfolioOutput = z.infer<typeof AnalyzePortfolioOutputSchema>;


export async function analyzePortfolio(
  input: AnalyzePortfolioInput
): Promise<AnalyzePortfolioOutput> {
  return analyzePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePortfolioPrompt',
  input: {schema: AnalyzePortfolioInputSchema},
  output: {schema: AnalyzePortfolioOutputSchema},
  prompt: `Você é uma IA analista financeira sofisticada. Sua tarefa é analisar o portfólio de ações de um usuário.

Você receberá uma lista de ativos (códigos e quantidades). Você deve gerar um preço de mercado atual plausível, mas fictício, para cada ativo.

Com base nesses preços fictícios, você deve calcular:
1.  O valor total de mercado para cada posição de ativo (quantidade * preço).
2.  O valor total de mercado de todo o portfólio.
3.  A alocação percentual de cada ativo dentro do portfólio.
4.  Forneça uma breve recomendação ou observação sobre a diversificação e o perfil de risco do portfólio com base nos ativos fornecidos.

**Ativos do Portfólio:**
{{#each assets}}
- Ticker: {{{ticker}}}, Quantidade: {{{quantity}}}
{{/each}}

Gere a análise completa do portfólio com base nessas informações.`,
});

const analyzePortfolioFlow = ai.defineFlow(
  {
    name: 'analyzePortfolioFlow',
    inputSchema: AnalyzePortfolioInputSchema,
    outputSchema: AnalyzePortfolioOutputSchema,
  },
  async input => {
    if (input.assets.length === 0) {
        return {
            totalValue: 0,
            assets: [],
            recommendation: "Seu portfólio está vazio. Adicione ativos para começar a análise.",
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
