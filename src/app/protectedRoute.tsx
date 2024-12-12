"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { getUserData } from "@/app/firestore/firestore";

interface ProtectedRouteProps {
    children: React.ReactNode;
    isRestricted?: boolean; // 인증되지 않은 사용자를 제한할지 여부
}

export default function ProtectedRoute({ children, isRestricted }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, userId, logout } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                if (!userId) {
                    if (isRestricted) {
                        router.replace("/Login");
                    }
                    setLoading(false);
                    return;
                }

                const userData = await getUserData(userId);
                if (!userData && isRestricted) {
                    setError("사용자 정보를 찾을 수 없습니다.");
                    console.warn("Firestore에서 사용자 정보를 찾을 수 없음");
                }
            } catch (err) {
                console.error("사용자 확인 중 오류 발생:", err);
                setError("사용자 확인 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [isRestricted, router, userId]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <>{children}</>;
}
