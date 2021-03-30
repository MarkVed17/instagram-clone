import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB34cL-QpqngocRsjM9lOFyIi5rr-Boziw",
    authDomain: "instagram-clone-9d1c9.firebaseapp.com",
    projectId: "instagram-clone-9d1c9",
    storageBucket: "instagram-clone-9d1c9.appspot.com",
    messagingSenderId: "615703853653",
    appId: "1:615703853653:web:f64f8a83678e3e2e97f2dc",
    measurementId: "G-DLLPZPKN9C"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};