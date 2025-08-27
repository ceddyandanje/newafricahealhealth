/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import twilio from "twilio";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options.
setGlobalOptions({maxInstances: 10});


// Configure Twilio client
// IMPORTANT: Replace placeholder values with your actual Twilio credentials.
// It is highly recommended to store these as environment variables/secrets.
// https://firebase.google.com/docs/functions/config-env
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID";
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "YOUR_TWILIO_PHONE_NUMBER";

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);


export const sendEmergencySmsNotification = onDocumentCreated("emergencies/{emergencyId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }
  const emergencyData = snapshot.data();
  logger.info(`New emergency created: ${event.params.emergencyId}`, emergencyData);


  // Find all emergency service providers to notify them.
  // In a real-world scenario, you would have a more sophisticated system
  // to find the *nearest* or *most appropriate* providers.
  const usersRef = db.collection("users");
  const querySnapshot = await usersRef.where("role", "==", "emergency-services").get();

  if (querySnapshot.empty) {
    logger.warn("No emergency service providers found to notify.");
    return;
  }

  const notificationPromises = querySnapshot.docs.map(async (doc) => {
    const provider = doc.data();

    // Check if the provider has a phone number and has enabled SMS notifications
    if (!provider.phone || !(provider as any).smsAlertsEnabled) {
      logger.log(`Provider ${provider.name} (${provider.id}) has no phone number or has SMS alerts disabled. Skipping.`);
      return;
    }

    const messageBody = `New Africa Heal Health Alert: ${emergencyData.serviceType} for ${emergencyData.patientName}. Situation: ${emergencyData.situationDescription || "N/A"}. Please check the dashboard.`;

    try {
      await twilioClient.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: provider.phone, // Assumes phone number is in E.164 format
      });
      logger.info(`Successfully sent SMS to ${provider.name} at ${provider.phone}`);
    } catch (error) {
      logger.error(`Failed to send SMS to ${provider.name}. Error:`, error);
    }
  });

  await Promise.all(notificationPromises);
});


// A simple callable function to test the environment
export const helloWorld = onCall((request) => {
  const name = request.data.name || "World";
  logger.info(`Received helloWorld call with name: ${name}`);
  return {message: `Hello, ${name}!`};
});
