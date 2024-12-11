import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAuthStore from "@/store/useAuthStore";

export default function ProtectedRoute({children, isRestricted}: { children: React.ReactNode, isRestricted?: boolean }) {
    const router = useRouter();
    const { isAuthenticated, login, logout } = useAuthStore();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                login(user.uid); // Zustand에 사용자 ID 저장
            } else {
                logout(); // 로그아웃 시 Zustand 초기화
                router.push("/Login"); // 로그인 페이지로 리다이렉트
            }
        });

        return () => unsubscribe();
    }, [login, logout, router]);

    // 인증 상태 확인 전에는 로딩 상태 표시
    if (!isAuthenticated) {
        return <div>로딩 중...</div>;
    }

    return <>{children}</>;
}
