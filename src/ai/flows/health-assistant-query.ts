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
  prompt: `You are the AHH assistant for Africa Heal Health. Your role is to provide information about Africa Heal Health's products and services based on user queries.

You MUST NOT provide any medical advice, diagnosis, or treatment recommendations. All health-related information should be general and educational. You should always recommend that the user consults a healthcare professional for personal medical advice.

When relevant to the user's query, you may suggest products available from Africa Heal Health.

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
