import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBdpkp1pcfHkieowhsGGFI4O7RYHEz_0-s",
    authDomain: "instagramclone-77ac2.firebaseapp.com",
    projectId: "instagramclone-77ac2",
    storageBucket: "instagramclone-77ac2.appspot.com",
    messagingSenderId: "378739713847",
    appId: "1:378739713847:web:5f4093b90114bb86ae1cb2",
    measurementId: "G-WK1FS4R0V1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
