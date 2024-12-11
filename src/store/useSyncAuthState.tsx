import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase 인증 관련 함수 가져오기
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore"; // Zustand 스토어 가져오기

// Firebase 인증 상태와 Zustand 상태 동기화 함수
const useSyncAuthState = () => {
    const setUserId = useAuthStore((state) => state.setUserId); // Zustand의 setUserId 가져오기

    useEffect(() => {
        const auth = getAuth(); // Firebase 인증 객체 가져오기

        // Firebase 인증 상태 변경 리스너 설정
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Firebase 인증된 사용자가 있을 경우 상태 업데이트
                setUserId(user.uid);
            } else {
                // 인증된 사용자가 없을 경우 상태 초기화
                setUserId(null);
            }
        });

        // 컴포넌트 언마운트 시 리스너 제거
        return () => unsubscribe();
    }, [setUserId]);
};

export default useSyncAuthState;
