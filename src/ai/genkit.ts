import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file configures Genkit for server-side use.
// It should not be imported into client components.
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// We only export the type for use in server-side flows.
export type AI = typeof ai;

/**
 * Internal getter for the AI instance.
 * Server-side flows should import this to use Genkit.
 * @private
 */
export function getAI(): AI {
    return ai;
}
