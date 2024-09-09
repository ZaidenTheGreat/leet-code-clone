import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUXnWWaENQB3dfzE1kak2i9uxNlhTaZ0A",
  authDomain: "cloneleet-8ced4.firebaseapp.com",
  databaseURL: "https://cloneleet-8ced4-default-rtdb.firebaseio.com",
  projectId: "cloneleet-8ced4",
  storageBucket: "cloneleet-8ced4.appspot.com",
  messagingSenderId: "431282080631",
  appId: "1:431282080631:web:7c11e4513c83c6fbd7ef72",
  measurementId: "G-CLNB61G3YH"
};

// Initialize Firebase
// const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, app };
