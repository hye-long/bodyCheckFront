// src/firestore/firebase.ts
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    initializeAuth,
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

// 성능 최적화된 인증 초기화
const auth = initializeAuth(app, {
    persistence: [
        indexedDBLocalPersistence,  // 브라우저 IndexedDB 사용
        browserLocalPersistence     // 로컬 스토리지 백업
    ]
});

// Firestore 초기화
const firestore = getFirestore(app);

// Analytics 초기화 변수
let analytics = null;

// 로그인 세션 지속성 설정 (추가 최적화)
const initializeFirebaseAuth = async () => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Firebase 인증 세션 설정 완료");

        // 인증 상태 변경 리스너 최적화
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("사용자 로그인:", user.uid);
                // 추가 사용자 정보 로딩 최소화
            } else {
                console.log("사용자 로그아웃");
            }
        }, (error) => {
            console.error("인증 상태 변경 중 오류:", error);
        });

    } catch (error) {
        console.error("Firebase 인증 초기화 오류:", error);
    }
};

// Analytics 초기화 함수
const initializeFirebaseAnalytics = async () => {
    if (typeof window !== 'undefined') {
        try {
            const supported = await isSupported();
            if (supported) {
                analytics = getAnalytics(app);
                console.log("Firebase Analytics 초기화 성공");
            } else {
                console.warn("Firebase Analytics 지원되지 않음");
            }
        } catch (error) {
            console.error("Analytics 초기화 중 오류:", error);
        }
    }
};

// 초기화 함수 실행
initializeFirebaseAuth();
initializeFirebaseAnalytics();

export {
    app,
    auth,
    firestore,
    analytics
};
