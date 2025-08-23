// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2yLCTkqh47yoPZ4f7JPClGDFuCxw0F0w",
  authDomain: "wiseprep-ebd53.firebaseapp.com",
  projectId: "wiseprep-ebd53",
  storageBucket: "wiseprep-ebd53.firebasestorage.app",
  messagingSenderId: "504556902094",
  appId: "1:504556902094:web:5f5c6bbf34f9e3f809e29f",
  measurementId: "G-SQRLFBYDL1"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);