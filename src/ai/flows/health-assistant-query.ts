'use server';

/**
 * @fileOverview A health assistant AI agent that answers health-related questions and suggests products.
 *
 * - healthAssistantQuery - A function that handles health-related queries and provides relevant information and product suggestions.
 * - HealthAssistantInput - The input type for the healthAssistantQuery function.
 * - HealthAssistantOutput - The return type for the healthAssistantQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAssistantInputSchema = z.object({
  query: z.string().describe('The user query about health concerns.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

const HealthAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the health query.'),
  suggestedProducts: z.array(z.string()).describe('A list of suggested products based on the query.'),
});
export type HealthAssistantOutput = z.infer<typeof HealthAssistantOutputSchema>;

export async function healthAssistantQuery(input: HealthAssistantInput): Promise<HealthAssistantOutput> {
  return healthAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthAssistantPrompt',
  input: {schema: HealthAssistantInputSchema},
  output: {schema: HealthAssistantOutputSchema},
  prompt: `You are a helpful AI health assistant. Answer the following health-related question and suggest relevant products.

Question: {{{query}}}

Format your response as a JSON object with "answer" and "suggestedProducts" fields. The "suggestedProducts" field should be a list of product names.`,
});

const healthAssistantFlow = ai.defineFlow(
  {
    name: 'healthAssistantFlow',
    inputSchema: HealthAssistantInputSchema,
    outputSchema: HealthAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
