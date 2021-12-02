import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Set the configuration for your app
const firebaseConfig = {
  apiKey: "AIzaSyA7U9Vg9SUTkMjaPrQMN5sJmFCjL3kvuIE",
  authDomain: "payashi-playground.firebaseapp.com",
  databaseURL:
    "https://payashi-playground-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "payashi-playground",
  storageBucket: "payashi-playground.appspot.com",
  messagingSenderId: "104879688845",
  appId: "1:104879688845:web:8102ae5116c613200ba6c4",
  measurementId: "G-TDJHGDCWMB",
};

const app = initializeApp(firebaseConfig);

export default app;

// Get a reference to the database service
export const db = getDatabase(app);
