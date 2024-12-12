
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    indexedDBLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

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

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 인증 초기화
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) =>
    console.error("Firebase 인증 지속성 설정 중 오류:", error)
);

// Firestore 초기화
const firestore = getFirestore(app);

// Analytics 초기화
let analytics: any = null;

if (typeof window !== "undefined") {
    isSupported()
        .then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
                console.log("Firebase Analytics 초기화 성공");
            } else {
                console.warn("Firebase Analytics 지원되지 않음");
            }
        })
        .catch((error) => console.error("Firebase Analytics 초기화 오류:", error));
}

// 인증 상태 리스너
onAuthStateChanged(
    auth,
    (user) => {
        if (user) {
            console.log("사용자 로그인:", user.uid);
            // Firestore에서 추가 데이터 로드
        } else {
            console.log("사용자 로그아웃");
        }
    },
    (error) => {
        console.error("인증 상태 변경 중 오류:", error);
    }
);

export { app, auth, firestore, analytics };
