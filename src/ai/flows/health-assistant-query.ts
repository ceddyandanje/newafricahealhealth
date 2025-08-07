
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
  query: z.string().describe('The user query about health concerns or a request for information on a medical specialty.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

const HealthAssistantOutputSchema = z.object({
  answer: z.string().describe('A detailed, helpful answer to the user\'s query. If the query is about a medical specialty, this should be a comprehensive description of the service and a "How to Get Service" guide.'),
  suggestedProducts: z.array(z.string()).describe('A list of suggested product categories or specific product names based on the query. For medical specialties, suggest three relevant product types.'),
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

If the user asks about a specific medical specialty, provide a detailed description of that service. Then, include a section titled "How to Get Service" with clear, actionable steps for a patient.

When relevant to the user's query, you may suggest products available from Africa Heal Health. If the query is about a medical specialty, suggest three specific types of products (e.g., 'Blood Pressure Monitor', 'Asthma Inhaler') that are relevant to that field.

Question: {{{query}}}

Format your response as a JSON object with "answer" and "suggestedProducts" fields. The "suggestedProducts" field should be a list of product names or types.`,
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
