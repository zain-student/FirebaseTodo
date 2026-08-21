// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_LRPvvD_dUNQEW1QTnG5fq44027Xyflk",
  authDomain: "expotodo-af2ab.firebaseapp.com",
  projectId: "expotodo-af2ab",
  storageBucket: "expotodo-af2ab.firebasestorage.app",
  messagingSenderId: "246982073233",
  appId: "1:246982073233:web:3b078bf64c343804019830",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
