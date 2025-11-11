
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "africa-heal-health-x8xrn.firebaseapp.com",
  projectId: "africa-heal-health-x8xrn",
  storageBucket: "africa-heal-health-x8xrn.appspot.com",
  messagingSenderId: "1045454466664",
  appId: "1:1045454466664:web:6670104342f19a293915dd",
  measurementId: "G-0S27909J1G"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);


export { app, auth, storage, db };
