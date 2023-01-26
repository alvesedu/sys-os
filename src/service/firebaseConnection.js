import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRJENGX3euRnRFVq11S0fH3YvIUMCJUB8",
  authDomain: "sys-os-b460e.firebaseapp.com",
  projectId: "sys-os-b460e",
  storageBucket: "sys-os-b460e.appspot.com",
  messagingSenderId: "774891852589",
  appId: "1:774891852589:web:ab336aefcb2f1e4a3779a4"
};

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}


export default firebase;

