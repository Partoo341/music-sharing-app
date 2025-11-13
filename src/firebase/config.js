// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdQDAyEsOcqKlqmaa3nOGOa8u7zqpifys",
    authDomain: "lenskings-productions.firebaseapp.com",
    projectId: "lenskings-productions",
    storageBucket: "lenskings-productions.firebasestorage.app",
    messagingSenderId: "815740011541",
    appId: "1:815740011541:web:348375d9d67112b2b9ba1c",
    measurementId: "G-FH29FR33H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Export the app instance as default
export default app;