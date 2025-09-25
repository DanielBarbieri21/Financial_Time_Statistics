// Summarize Financial News
'use server';
/**
 * @fileOverview Summarizes financial news articles and classifies their sentiment.
 *
 * - summarizeFinancialNews - A function that summarizes financial news articles and classifies their sentiment.
 * - SummarizeFinancialNewsInput - The input type for the summarizeFinancialNews function.
 * - SummarizeFinancialNewsOutput - The return type for the summarizeFinancialNews function.
 */

import { getAI } from '@/ai/genkit';
import {z} from 'genkit';

const ai = getAI();

const SummarizeFinancialNewsInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the financial news article to summarize.'),
});
export type SummarizeFinancialNewsInput = z.infer<
  typeof SummarizeFinancialNewsInputSchema
>;

const SummarizeFinancialNewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the financial news article.'),
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the financial news article.'),
});
export type SummarizeFinancialNewsOutput = z.infer<
  typeof SummarizeFinancialNewsOutputSchema
>;

export async function summarizeFinancialNews(
  input: SummarizeFinancialNewsInput
): Promise<SummarizeFinancialNewsOutput> {
  return summarizeFinancialNewsFlow(input);
}

const summarizeFinancialNewsPrompt = ai.definePrompt({
  name: 'summarizeFinancialNewsPrompt',
  input: {schema: SummarizeFinancialNewsInputSchema},
  output: {schema: SummarizeFinancialNewsOutputSchema},
  prompt: `Resuma o seguinte artigo de notícia financeira e classifique seu sentimento como positivo, negativo ou neutro.\n\nArtigo: {{{articleContent}}}\n\nResumo:\nSentimento:`,
});

const summarizeFinancialNewsFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialNewsFlow',
    inputSchema: SummarizeFinancialNewsInputSchema,
    outputSchema: SummarizeFinancialNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeFinancialNewsPrompt(input);
    return output!;
  }
);
