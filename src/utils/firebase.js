// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4DeOW084yhVNzEf9aUit-N-iCvWSO89g",
  authDomain: "cloudy-8447b.firebaseapp.com",
  projectId: "cloudy-8447b",
  storageBucket: "cloudy-8447b.appspot.com",
  messagingSenderId: "163965311898",
  appId: "1:163965311898:web:9bf013223b52288c87b823",
  measurementId: "G-D29KDZJ1W5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseAuth = getAuth()