import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdtLv13cFzgn4Ccx8tQTNx3IBpWMVF0Lw",
  authDomain: "lifelink-ai-5bf0e.firebaseapp.com",
  projectId: "lifelink-ai-5bf0e",
  storageBucket: "lifelink-ai-5bf0e.firebasestorage.app",
  messagingSenderId: "409440726399",
  appId: "1:409440726399:web:42e03989526505db527e4a",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebase() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getDb() {
  if (!db) db = getFirestore(getFirebase());
  return db;
}
