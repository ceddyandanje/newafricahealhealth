'use server';

/**
 * @fileOverview An AI agent that suggests relevant products based on health-related questions.
 *
 * - suggestProducts - A function that handles the product suggestion process.
 * - SuggestProductsInput - The input type for the suggestProducts function.
 * - SuggestProductsOutput - The return type for the suggestProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  query: z
    .string()
    .describe('The health-related question or need from the user.'),
});
export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const SuggestProductsOutputSchema = z.object({
  products: z
    .array(z.string())
    .describe('A list of product names that are relevant to the query.'),
  reasoning: z
    .string()
    .describe('The AI assistant reasoning for suggesting these products.'),
});
export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductsPrompt',
  input: {schema: SuggestProductsInputSchema},
  output: {schema: SuggestProductsOutputSchema},
  prompt: `You are a helpful AI health assistant that suggests relevant products based on the user's health-related question or need.

  Respond with a list of relevant products and your reasoning for suggesting them.

  User Query: {{{query}}}
  `,
});

const suggestProductsFlow = ai.defineFlow(
  {
    name: 'suggestProductsFlow',
    inputSchema: SuggestProductsInputSchema,
    outputSchema: SuggestProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
