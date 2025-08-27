
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
  patientName: z.string().optional(),
  situationDescription: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  timeSinceRequest: z.string().optional(),
});
export type EmergencyInput = z.infer<typeof EmergencyInputSchema>;

const EmergencyResponseOutputSchema = z.object({
  summary: z.string().describe('A summary of the patient and their situation, written in a clear, concise, and professional tone suitable for a dispatcher. Start with a recommendation based on the service type. Include all provided patient details.'),
  lawEnforcementNeeded: z.boolean().describe('Whether law enforcement (police) assistance is likely required based on the situation description (e.g., assault, accident, public disturbance).'),
  nearestHospital: z.string().describe('The name of the closest major hospital to the provided coordinates. If in Nairobi, suggest "Aga Khan University Hospital" or "Nairobi Hospital". For other areas, state "Determine closest facility".'),
});
export type EmergencyResponseOutput = z.infer<typeof EmergencyResponseOutputSchema>;

export async function suggestEmergencyResponse(input: EmergencyInput): Promise<EmergencyResponseOutput> {
  return suggestEmergencyResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmergencyResponsePrompt',
  input: {schema: EmergencyInputSchema},
  output: {schema: EmergencyResponseOutputSchema},
  prompt: `You are an AI assistant for an emergency dispatch command center in Kenya. Your role is to provide a quick, actionable summary to human dispatchers based on incoming requests.

Analyze the situation description to determine if law enforcement is needed (e.g., for traffic accidents, assaults, etc.) and identify the nearest major hospital.

Generate a response object based on the following logic:
- **Summary**: Create a summary using this template. Only include fields if they have data.
    - **Recommendation**: [If 'Ground Ambulance' or 'Air Ambulance', suggest "Dispatch the nearest unit." If 'First Aid', suggest "Provide First Aid triage questions."].
    - **Patient**: [Patient Name]
    - **Situation**: [Situation Description]
    - **Request Time**: [Time Since Request]
    - **Vitals**: Blood Group: [Blood Group], Allergies: [Allergies]
- **lawEnforcementNeeded**: [Set to true if the situation involves an accident, crime, or public safety risk.]
- **nearestHospital**: [Based on coordinates. If Lat/Lon is near Nairobi (approx -1.2, 36.8), suggest "Nairobi Hospital" or "Aga Khan University Hospital". Otherwise, suggest "Determine closest facility".]

Request Details:
- Service Needed: {{{serviceType}}}
- Patient Name: {{{patientName}}}
- Location (Lat/Lon): {{{location.latitude}}}, {{{location.longitude}}}
- Situation: {{{situationDescription}}}
- Blood Group: {{{bloodGroup}}}
- Known Allergies: {{{allergies}}}
- Time Since Request: {{{timeSinceRequest}}}
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
