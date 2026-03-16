


// Import Firebase scripts (compat version works in SW)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase inside Service Worker
firebase.initializeApp({

   apiKey: "AIzaSyCCh8-6pj5P6dWkEnwJzL8ckNKLa3x9sz8",
  authDomain: "chatnova-8ebd4.firebaseapp.com",
  projectId: "chatnova-8ebd4",
  storageBucket: "chatnova-8ebd4.firebasestorage.app",
  messagingSenderId: "879478735679",
  appId: "1:879478735679:web:9ee1c2d165f9abf05f498a",
  measurementId: "G-2NQLBZ13C9"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();


self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("push", (event) => {
  console.log("Push received:", event);
});
// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message', payload);
  const notificationTitle = payload?.notification?.title || "New message";
  const notificationOptions = {
    body: payload?.notification?.body || " " ,
    icon: '/favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});