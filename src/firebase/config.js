import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_2Z8jD5gX6Q8Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q",
    authDomain: "music-sharing-app-12345.firebaseapp.com",
    projectId: "music-sharing-app-12345",
    storageBucket: "music-sharing-app-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;