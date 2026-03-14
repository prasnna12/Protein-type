import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFIQCtZs-zct6BuXrzsKuhwZGfHbrm0Yk",
  authDomain: "prasnna-gym.firebaseapp.com",
  projectId: "prasnna-gym",
  storageBucket: "prasnna-gym.firebasestorage.app",
  messagingSenderId: "82501350345",
  appId: "1:82501350345:web:d3086abc4a11af20ac6e18",
  measurementId: "G-FF4ELKLLFE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
