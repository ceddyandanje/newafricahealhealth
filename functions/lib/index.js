"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = exports.sendEmergencySmsNotification = void 0;
const v2_1 = require("firebase-functions/v2");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
const twilio_1 = __importDefault(require("twilio"));
// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options.
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
// Configure Twilio client
// IMPORTANT: Replace placeholder values with your actual Twilio credentials.
// It is highly recommended to store these as environment variables/secrets.
// https://firebase.google.com/docs/functions/config-env
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID";
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "YOUR_TWILIO_PHONE_NUMBER";
const twilioClient = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
exports.sendEmergencySmsNotification = (0, firestore_1.onDocumentCreated)("emergencies/{emergencyId}", async (event) => {
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
        if (!provider.phone || !provider.smsAlertsEnabled) {
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
        }
        catch (error) {
            logger.error(`Failed to send SMS to ${provider.name}. Error:`, error);
        }
    });
    await Promise.all(notificationPromises);
});
// A simple callable function to test the environment
exports.helloWorld = (0, https_1.onCall)((request) => {
    const name = request.data.name || "World";
    logger.info(`Received helloWorld call with name: ${name}`);
    return { message: `Hello, ${name}!` };
});
//# sourceMappingURL=index.js.map