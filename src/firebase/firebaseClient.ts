// src/firebase/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjYK1NdCColHI0LwES1eutVxOrIh5UaRA",
  authDomain: "daye-ai-teacher.firebaseapp.com",
  projectId: "daye-ai-teacher",
  storageBucket: "daye-ai-teacher.appspot.com",
  messagingSenderId: "597290684529",
  appId: "1:597290684529:web:8487929d86b075a28c4bd0",
  measurementId: "G-6XJ1D6T8J3",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const db = getFirestore();
export const auth = getAuth();
