import { initializeApp } from "firebase/app";
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication e obtém uma referência para o serviço
export const auth = getAuth(app);

// Inicializa o Cloud Firestore e obtém uma referência para o serviço
export const db = getFirestore(app);