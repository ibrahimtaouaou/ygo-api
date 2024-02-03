import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUEglBLU_C-es_sB05_joSv5Gp0R3JkvA",
  authDomain: "yu-gi-oh-1cf75.firebaseapp.com",
  databaseURL:
    "https://yu-gi-oh-1cf75-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yu-gi-oh-1cf75",
  storageBucket: "yu-gi-oh-1cf75.appspot.com",
  messagingSenderId: "108352935243",
  appId: "1:108352935243:web:5d10994169962a461d04ce",
  measurementId: "G-7L0BPJ2R4L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Real-time database
export const db = getDatabase();
// Firebase storage
export const storage = getStorage(app);
