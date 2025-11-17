// FIX: Updated Firebase initialization to use the modular (v9) API. This resolves type errors by providing the correct service instances for v9 functions used throughout the application.
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do seu projeto Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCfmYEpGNC1gTDtm-7X0OIWP3W3eQGXXYQ",
  authDomain: "perifacode-fc132.firebaseapp.com",
  projectId: "perifacode-fc132",
  storageBucket: "perifacode-fc132.appspot.com",
  messagingSenderId: "864131556184",
  appId: "1:864131556184:web:3fad411905a7d6d9307b2d",
  measurementId: "G-TV2MTZTZ8C"
};

// Initialize Firebase, preventing re-initialization in HMR environments.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export v9 modular service instances.
export const auth = getAuth(app);
export const db = getFirestore(app);
