import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };