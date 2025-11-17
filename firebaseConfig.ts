// FIX: Corrected Firebase initialization by using named imports for `getApps`, `initializeApp`, and `getApp` from "firebase/app". The previous namespace import (`import * as firebase`) was incorrect for the Firebase v9+ modular SDK and caused the "property does not exist" errors.
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

// Inicializa o Firebase usando a API modular, evitando reinicializações.
// FIX: Use direct function calls as per Firebase v9+ modular SDK.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta instâncias dos serviços modulares.
export const auth = getAuth(app);
export const db = getFirestore(app);
