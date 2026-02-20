import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdHbwPJ-cZZ_c-qiftp--Fd-qR2WKu2es",
  authDomain: "class-management-system-dbdbb.firebaseapp.com",
  projectId: "class-management-system-dbdbb",
  storageBucket: "class-management-system-dbdbb.firebasestorage.app",
  messagingSenderId: "366671976637",
  appId: "1:366671976637:web:2f382203c8e5b112f9ffd4",
  measurementId: "G-JME8LVB4P6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);