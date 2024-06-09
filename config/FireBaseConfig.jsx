// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFWK3Wkl9FDd-9osi-g_NaIBjQDLboqys",
  authDomain: "business-directory-75d81.firebaseapp.com",
  projectId: "business-directory-75d81",
  storageBucket: "business-directory-75d81.appspot.com",
  messagingSenderId: "1055226892586",
  appId: "1:1055226892586:web:498422a4d0d461ade10e53",
  measurementId: "G-3P7F6KPSQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);