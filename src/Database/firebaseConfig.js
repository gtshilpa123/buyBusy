// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwYnnrE2bbcUbVRueulxve8LRrAXMeMRs",
  authDomain: "buybusy-96d84.firebaseapp.com",
  projectId: "buybusy-96d84",
  storageBucket: "buybusy-96d84.firebasestorage.app",
  messagingSenderId: "1023488829259",
  appId: "1:1023488829259:web:98c276dfc42079ee4d6ace",
  measurementId: "G-K05G4PQKE5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
