
'use server';
/**
 * @fileOverview An AI flow to suggest responses for emergency dispatchers.
 *
 * - suggestEmergencyResponse - Provides a concise, actionable suggestion for an emergency request.
 * - EmergencyInput - The input type for the flow.
 * - EmergencyResponseOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyInputSchema = z.object({
  serviceType: z.enum(['First Aid', 'Ground Ambulance', 'Air Ambulance']),
  location: z.object({
      latitude: z.number(),
      longitude: z.number(),
  }),
});
export type EmergencyInput = z.infer<typeof EmergencyInputSchema>;

const EmergencyResponseOutputSchema = z.object({
  suggestion: z.string().describe('A clear, concise, and actionable suggestion for the dispatcher. For ambulance requests, suggest dispatching the nearest unit. For First Aid, provide key triage questions to ask the caller.'),
});
export type EmergencyResponseOutput = z.infer<typeof EmergencyResponseOutputSchema>;

export async function suggestEmergencyResponse(input: EmergencyInput): Promise<EmergencyResponseOutput> {
  return suggestEmergencyResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmergencyResponsePrompt',
  input: {schema: EmergencyInputSchema},
  output: {schema: EmergencyResponseOutputSchema},
  prompt: `You are an AI assistant for an emergency dispatch command center. Your role is to provide quick, actionable advice to human dispatchers based on incoming requests.

You will be given the service type requested and the location.

- If the service is 'Ground Ambulance' or 'Air Ambulance', your suggestion should be to "Dispatch the nearest available unit to the location." and mention what to look for on the map.
- If the service is 'First Aid', your suggestion should be to provide a few critical triage questions for the dispatcher to ask the caller, such as "1. Is the person conscious and breathing? 2. Is there any severe bleeding? 3. Can you describe the injury or symptoms?".

Keep the response brief and direct.

Request Details:
- Service Needed: {{{serviceType}}}
- Location (Lat/Lon): {{{location.latitude}}}, {{{location.longitude}}}
`,
});

const suggestEmergencyResponseFlow = ai.defineFlow(
  {
    name: 'suggestEmergencyResponseFlow',
    inputSchema: EmergencyInputSchema,
    outputSchema: EmergencyResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
