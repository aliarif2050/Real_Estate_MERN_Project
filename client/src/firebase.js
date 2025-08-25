// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9c71a.firebaseapp.com",
  projectId: "mern-estate-9c71a",
  storageBucket: "mern-estate-9c71a.firebasestorage.app",
  messagingSenderId: "980397444534",
  appId: "1:980397444534:web:7b9f98f47b6abdbac1c517"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);