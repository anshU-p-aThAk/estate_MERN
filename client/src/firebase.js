// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-a5681.firebaseapp.com",
    projectId: "mern-estate-a5681",
    storageBucket: "mern-estate-a5681.appspot.com",
    messagingSenderId: "220473402892",
    appId: "1:220473402892:web:21f7d0b56442ee42383029"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);