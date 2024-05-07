// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALXUFPqY0udNYwbXxnkOo4uHDqWXbuh_0",
  authDomain: "gamevortex-7eca9.firebaseapp.com",
  projectId: "gamevortex-7eca9",
  storageBucket: "gamevortex-7eca9.appspot.com",
  messagingSenderId: "1072538243578",
  appId: "1:1072538243578:web:a033b6e653e07928819443"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);