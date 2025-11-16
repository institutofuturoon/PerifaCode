// FIX: Switched from an incorrect namespace import to named imports for Firebase v9+ SDK compatibility.
// This resolves 'property does not exist' errors for getApps, initializeApp, and getApp.
import { initializeApp, getApps, getApp } from "firebase/app";
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

// Inicializa o Firebase de forma segura para ambientes com HMR.
// Garante que o app seja inicializado apenas uma vez.
// FIX: Replaced namespace-based calls (e.g., firebase.getApps) with direct function calls
// to align with the modular Firebase v9+ SDK.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa e exporta o Firebase Authentication.
export const auth = getAuth(app);

// Inicializa e exporta o Cloud Firestore.
export const db = getFirestore(app);
