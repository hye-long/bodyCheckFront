"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import Chart from "@/app/componenets/Chart";

// 운동 세트 인터페이스
interface WorkoutSet {
    reps: number; // 반복 횟수
    weight: string; // 무게
}

// 운동 세션 인터페이스
interface WorkoutSession {
    workout_type: string; // 운동 종류
    sets: WorkoutSet[]; // 세트 배열
    date: string; // 운동 날짜
}

const Dashboard = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 userId 가져오기
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]); // 운동 세션 상태
    const [targetReps, setTargetReps] = useState<{ [key: string]: number }>({
        benchpress: 10, // 기본 목표 반복 횟수
        squat: 10,
        deadlift: 10,
    });
    const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
    const [error, setError] = useState<string | null>(null); // 오류 메시지 상태

    // Firestore에서 사용자 이름을 가져오는 함수
    const fetchUserName = async () => {
        if (!userId) return; // userId가 없으면 실행하지 않음
        try {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                setUserName(userDoc.data().name); // 사용자 이름 상태 업데이트
            } else {
                setUserName(null); // 사용자 정보가 없을 경우 초기화
                console.warn("사용자 정보를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 이름을 가져오는 중 오류가 발생했습니다:", error);
            setError("사용자 이름을 가져오는 중 오류가 발생했습니다.");
        }
    };

    // Firestore에서 운동 세션 데이터를 가져오는 함수
    const fetchWorkoutSessions = async () => {
        if (!userId) return; // userId가 없으면 실행하지 않음
        try {
            const q = query(
                collection(firestore, "workout_sessions"),
                where("user_id", "==", userId)
            );
            const snapshot = await getDocs(q);
            const sessions = snapshot.docs.map((doc) => doc.data() as WorkoutSession);
            setWorkoutSessions(sessions); // 운동 세션 상태 업데이트
        } catch (error) {
            console.error("운동 세션 가져오기 오류:", error);
            setError("운동 세션 데이터를 가져오는 중 오류가 발생했습니다.");
        }
    };

    // 목표 반복 횟수를 업데이트하는 함수
    const updateTargetReps = (workoutType: string, newTarget: number) => {
        setTargetReps((prev) => ({ ...prev, [workoutType]: newTarget })); // 특정 운동 종류의 목표 반복 횟수 변경
    };

    // 컴포넌트가 마운트될 때 Firestore 데이터를 가져오는 함수 실행
    useEffect(() => {
        if (userId) {
            setIsLoading(true); // 로딩 시작
            Promise.all([fetchUserName(), fetchWorkoutSessions()])
                .then(() => setError(null)) // 오류 초기화
                .finally(() => setIsLoading(false)); // 로딩 종료
        } else {
            setUserName(null); // 로그아웃 상태일 경우 초기화
            setWorkoutSessions([]); // 운동 세션 초기화
        }
    }, [userId]);

    // 데이터 로딩 중인 경우 로딩 메시지 출력
    if (isLoading) {
        return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;
    }

    // 오류가 발생한 경우 오류 메시지 출력
    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>오류가 발생했습니다: {error}</p>
            </div>
        );
    }

    // 대시보드 UI 렌더링
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-12 gap-6">
                {/* 사이드바 영역 */}
                <aside className="col-span-3 bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">운동 요약</h2>
                    <ul>
                        <li>
                            총 세션: <span className="font-bold">{workoutSessions.length}</span>
                        </li>
                        <li>
                            사용자: <span className="font-bold">{userName || "미정"}</span>
                        </li>
                    </ul>
                </aside>

                {/* 메인 콘텐츠 영역 */}
                <main className="col-span-9 space-y-8">
                    <header className="bg-white p-4 rounded-lg shadow mb-6">
                        <h1 className="text-3xl font-bold">안녕하세요 {userName || "회원"}님 👋</h1>
                        <p className="text-lg text-gray-600">오늘의 운동 기록을 확인하세요!</p>
                    </header>

                    {/* 차트 컴포넌트 */}
                    <Chart
                        workoutData={workoutSessions}
                        targetReps={targetReps}
                        onUpdateTargetReps={updateTargetReps}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard; // 대시보드 컴포넌트 내보내기
