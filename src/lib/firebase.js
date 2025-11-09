// src/lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Your VibeTalk Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU095UD_UI7Cph-T-PxSWsBJus4c-F0Fs",
  authDomain: "vibetalk-43486.firebaseapp.com",
  projectId: "vibetalk-43486",
  storageBucket: "vibetalk-43486.firebasestorage.app",
  messagingSenderId: "1073001839377",
  appId: "1:1073001839377:web:fca4d24c266f5880672ab0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);
