import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const firebaseCongig = {
  apiKey: "AIzaSyCCh8-6pj5P6dWkEnwJzL8ckNKLa3x9sz8",
  authDomain: "chatnova-8ebd4.firebaseapp.com",
  projectId: "chatnova-8ebd4",
  messagingSenderId: "879478735679",
  appId: "1:879478735679:web:9ee1c2d165f9abf05f498a",
};

const app = initializeApp(firebaseCongig);
export const messaging = getMessaging(app);
