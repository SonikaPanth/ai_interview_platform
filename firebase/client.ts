// Import the functions you need from the SDKs you need
import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXC9LXGkR-lP1YiZs2uzwAhAvGW8hKTkM",
  authDomain: "prepwise-377d4.firebaseapp.com",
  projectId: "prepwise-377d4",
  storageBucket: "prepwise-377d4.firebasestorage.app",
  messagingSenderId: "1077018666393",
  appId: "1:1077018666393:web:5a4ecefdea9b72dd279f08",
  measurementId: "G-WS0GGRWNW2"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);