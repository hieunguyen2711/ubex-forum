// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9wO32N2uHTuqj3qV2io5Cpuiq00y6ZXk",
  authDomain: "uber-forum-ee622.firebaseapp.com",
  projectId: "uber-forum-ee622",
  storageBucket: "uber-forum-ee622.firebasestorage.app",
  messagingSenderId: "758424988894",
  appId: "1:758424988894:web:1e2148c8bfd7080d0b264f",
  measurementId: "G-10Z7106JYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app , auth };