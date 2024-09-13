import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC9JJvwyN5qpUtHCtIgUgOBGoaGRmSTzg",
  authDomain: "sports-f17a6.firebaseapp.com",
  projectId: "sports-f17a6",
  storageBucket: "sports-f17a6.appspot.com",
  messagingSenderId: "596605125231",
  appId: "1:596605125231:web:fe8470bd50fcaa7927439a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore();
export const storage = getStorage(app);
