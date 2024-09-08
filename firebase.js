// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdUjFkYbsx7Pt9x70TWboeIdj6uvhm1-Y",
  authDomain: "chachachat-a163c.firebaseapp.com",
  databaseURL: "https://chachachat-a163c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chachachat-a163c",
  storageBucket: "chachachat-a163c.appspot.com",
  messagingSenderId: "277750700770",
  appId: "1:277750700770:web:974ffbb4c438b078675cbb",
  measurementId: "G-GWL021BGWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }