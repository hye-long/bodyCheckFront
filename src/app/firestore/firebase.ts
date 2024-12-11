import {getApp, getApps, initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Firebase 설정 객체
const firebaseConfig = {
    apiKey: "AIzaSyA26i3f-AcLDwS7OYZe_WX_YywbrdizUp8",
    authDomain: "bodycheck-e75b2.firebaseapp.com",
    projectId: "bodycheck-e75b2",
    storageBucket: "bodycheck-e75b2.appspot.com",
    messagingSenderId: "568418655449",
    appId: "1:568418655449:web:45335ac48599fbcbc6b2c8",
    measurementId: "G-JZP73GSNYJ",
};

// Firebase 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);





export { app, auth, firestore };
