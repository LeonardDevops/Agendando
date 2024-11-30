// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { aut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBr0LJohqvQ8qlpXSpYVbuNlLHpu-xwz40",
    authDomain: "agendando-c0098.firebaseapp.com",
    projectId: "agendando-c0098",
    storageBucket: "agendando-c0098.firebasestorage.app",
    messagingSenderId: "151272631620",
    appId: "1:151272631620:web:808985176771205cfe7b11",
    measurementId: "G-B8XPFQTPDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app)

export { db }