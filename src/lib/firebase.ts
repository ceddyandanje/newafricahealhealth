
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "africa-heal-health-x8xrn",
  appId: "1:1045454466664:web:6670104342f19a293915dd",
  storageBucket: "africa-heal-health-x8xrn.appspot.com",
  apiKey: "AIzaSyBneaW2qiPeFUuUzK6MpsSEQS3JGc3dAYA",
  authDomain: "africa-heal-health-x8xrn.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "1045454466664"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);


export { app, storage, db };
