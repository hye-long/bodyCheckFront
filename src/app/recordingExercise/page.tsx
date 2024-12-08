"use client";

import DashboardLayout from "@/app/componenets/dashboardLayout";
import React, { useEffect, useState } from "react";
import styles from "@/app/dashboard/dashboard.module.css";
import useAuthStore from "@/store/useAuthStore";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

// Workout 세션 가져오는 함수 (현재 비어있음)
function fetchWorkoutSessions() {
    // 서버에서 운동 세션을 가져오는 로직을 추가하세요.
}

// 로딩 상태 설정 함수 (현재 비어있음)
function setIsLoading(b: boolean) {
    // 로딩 상태를 업데이트하는 로직을 추가하세요.
}

export default function RecordingExercise() {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 로그인된 사용자 ID 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태

    // 사용자 이름을 Firestore에서 가져오는 함수
    const fetchUserName = async () => {
        if (!userId) return; // userId가 없으면 실행하지 않음 (로그아웃 상태)
        try {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserName(data.name); // Firestore에서 사용자 이름 가져오기
            } else {
                console.error("사용자 정보를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 이름을 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    // useEffect에서 userId가 있을 때만 fetchUserName 호출
    useEffect(() => {
        if (userId) {
            fetchUserName(); // userId가 존재할 경우에만 실행
            fetchWorkoutSessions(); // 운동 세션 가져오기
        } else {
            setUserName(null); // 로그아웃 상태에서는 사용자 이름 초기화
        }
        setIsLoading(false); // 데이터 로딩 상태 해제
    }, [userId]);

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className={styles.introTitle}>
                    안녕하세요 {userName || "회원"} 님!
                </h1>
                <p className={styles.introSubtitle}>
                    오늘의 운동 기록을 확인해보세요!
                </p>
            </div>
        </DashboardLayout>
    );
}
