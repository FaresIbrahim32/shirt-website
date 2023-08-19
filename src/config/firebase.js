// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8w8HoX2pb9DHkEvsyktaQPdjVjiBYZ_4",
  authDomain: "shirt-website.firebaseapp.com",
  projectId: "shirt-website",
  storageBucket: "shirt-website.appspot.com",
  messagingSenderId: "703304529570",
  appId: "1:703304529570:web:2a65c8146f84fabe1889fb",
  measurementId: "G-1HPE681ETS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);