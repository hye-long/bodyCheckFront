import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAuthStore from "@/store/useAuthStore";

const useSyncAuthState = () => {
    const { login, logout } = useAuthStore();

    useEffect(() => {
        if (typeof window !== 'undefined') { // 클라이언트 사이드에서만 동작
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    login(user.uid);
                    console.log("Firebase 사용자 인증됨:", user.uid);
                } else {
                    logout();
                    console.log("로그아웃 상태로 전환");
                }
            });

            return () => unsubscribe();
        }
    }, [login, logout]);

};

export default useSyncAuthState;
