// FIX: Changed to namespace import to resolve module export errors.
import * as firebaseApp from "firebase/app";
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

// Inicializa o Firebase, evitando reinicializações para
// garantir que a instância seja única, especialmente em ambientes de desenvolvimento.
const app = firebaseApp.getApps().length > 0 ? firebaseApp.getApp() : firebaseApp.initializeApp(firebaseConfig);

// Exporta instâncias dos serviços, usando a API modular v9.
export const auth = getAuth(app);
export const db = getFirestore(app);