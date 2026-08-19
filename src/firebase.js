import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2JaalhGPJzLZz6muHP5PfTpfI2_kVkD8",
  authDomain: "alba-3aa4e.firebaseapp.com",
  projectId: "alba-3aa4e",
  storageBucket: "alba-3aa4e.firebasestorage.app",
  messagingSenderId: "704171333033",
  appId: "1:704171333033:web:d114e82fd527606f1220b8",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);