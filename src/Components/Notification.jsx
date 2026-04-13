import {  getToken } from "firebase/messaging";
import { messaging } from "../Firebase/firebase.cjs";
import api from "../Api/Axios";

 // Register service worker and get FCM token
  async function initFCM() {
    try {
       const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
  
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPIEDKEY, // from Firebase console
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        try {
          const res = await api.post("/auth/deviceToken", {
            deviceToken: currentToken,
          });
        } catch (error) {
  console.log(error)
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one.",
        );
      }
    } catch (err) {
      console.error("FCM registration error:", err);
    }
  }
  export default initFCM;
