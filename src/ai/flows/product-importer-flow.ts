
'use server';

/**
 * @fileOverview An AI flow to enrich product data from a raw text list.
 *
 * - enrichProductData - Takes a string of product names and prices and returns a structured list of product objects.
 * - ProductImportInput - The input type for the flow.
 * - ProductImportOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductImportInputSchema = z.object({
  rawProductData: z.string().describe('A raw block of text extracted from a PDF containing product names and prices.'),
});
export type ProductImportInput = z.infer<typeof ProductImportInputSchema>;

// Define a schema that matches the fields in our Product type, excluding the ID
const EnrichedProductDataSchema = z.object({
    name: z.string().describe("The full name of the product."),
    description: z.string().describe("A concise, well-written product description suitable for an e-commerce site."),
    price: z.number().describe("The product's price in cents (e.g., 550.00 KES should be 55000)."),
    stock: z.number().describe("A default stock quantity, which should be set to 50 for all new products."),
    image: z.string().url().describe("A placeholder image URL. ALWAYS use 'https://placehold.co/600x400.png' for this value."),
    dataAiHint: z.string().describe("A one or two-word hint for a future AI to find a real image. E.g., 'blood pressure monitor'."),
    category: z.string().describe("The most relevant medical or e-commerce category for the product."),
    brand: z.string().describe("The likely manufacturer or brand name of the product. If unknown, use 'Generic'."),
    tags: z.array(z.string()).describe("An array of relevant tags. ALWAYS include 'new' as one of the tags."),
});
export type EnrichedProductData = z.infer<typeof EnrichedProductDataSchema>;


const ProductImportOutputSchema = z.object({
  products: z.array(EnrichedProductDataSchema),
});
export type ProductImportOutput = z.infer<typeof ProductImportOutputSchema>;

export async function enrichProductData(input: ProductImportInput): Promise<ProductImportOutput> {
  return productImporterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productEnrichmentPrompt',
  input: { schema: ProductImportInputSchema },
  output: { schema: ProductImportOutputSchema },
  prompt: `You are an expert catalog manager for a medical supply e-commerce store.
You will be given a raw block of text extracted from a PDF. This text contains a list of products and their prices, and may also include irrelevant headers, footers, titles, addresses, and page numbers. The main product list might be formatted in a multi-column, tabular layout.

Your primary task is to act like an intelligent data entry clerk:
1.  **Analyze the Entire Text**: First, read the whole text to understand its structure.
2.  **Identify and Isolate Product Data**: Intelligently identify the main list of products and prices. **You must ignore all non-product information**, such as the document title, company headings, addresses, footers, and page numbers. Focus only on the medication/product list.
3.  **Parse the Product List**: Correctly extract each product name and its corresponding price, even if they are in different columns.

For each product you successfully extract, perform the following enrichment tasks:
1.  **Extract Name and Price**: Identify the full product name and its price from the text. Convert the price to cents by multiplying by 100.
2.  **Generate a Product Description**: Write a clear, concise, and professional description for the product.
3.  **Determine a Category**: Assign a logical category (e.g., "Cardiovascular", "Diabetes Care", "Surgical Equipment", "Pain Relief").
4.  **Determine a Brand**: Infer the brand name. If it's not obvious, use "Generic".
5.  **Set Defaults**:
    - Set the 'stock' to 50.
    - Set the 'image' URL to EXACTLY 'https://placehold.co/600x400.png'.
    - Create a 'dataAiHint' with one or two keywords from the product name.
    - Create a 'tags' array and ALWAYS include the string 'new' in it.

Your final output must be a single JSON object with a "products" key, which contains an array of the structured product data you have generated. Only include products you were able to identify.

Here is the raw text from the PDF:
{{{rawProductData}}}
`,
});

const productImporterFlow = ai.defineFlow(
  {
    name: 'productImporterFlow',
    inputSchema: ProductImportInputSchema,
    outputSchema: ProductImportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate an output.");
    }
    return output;
  }
);
