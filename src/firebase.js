// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC9uT8pM_sYSs6gX1bQysKMPyUbwJF0JWI",
  authDomain: "whatsapp-clone-101.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-101.firebaseio.com",
  projectId: "whatsapp-clone-101",
  storageBucket: "whatsapp-clone-101.appspot.com",
  messagingSenderId: "446054377569",
  appId: "1:446054377569:web:292f6aa6a55a74a67b6220",
  measurementId: "G-DR4SK6S9R8",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
export { db, auth, storage, provider };
// export default db;
