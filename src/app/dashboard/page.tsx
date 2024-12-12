"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import Chart from "@/app/componenets/Chart";
import CustomCalendar from "../componenets/CustomCalendar";
import "react-datepicker/dist/react-datepicker.css";


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
    color?: string;

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
    const [selectedDate, setSelectedDate] = useState<Date | string>(new Date());
    const [filteredSessions, setFilteredSessions] = useState<WorkoutSession[]>([]); // 날짜별로 필터링된 세션
    const [lineChartData, setLineChartData] = useState<any>(null); // 꺾은선 차트 데이터
    const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
    const [error, setError] = useState<string | null>(null); // 오류 메시지 상태

    // Firestore에서 사용자 이름 가져오기
    const fetchUserName = async () => {
        if (!userId) return;
        try {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                setUserName(userDoc.data().name);
            } else {
                setUserName(null);
                console.warn("사용자 정보를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("사용자 이름을 가져오는 중 오류 발생:", error);
            setError("사용자 이름을 가져오는 중 오류가 발생했습니다.");
        }
    };

    const enrichedSessions = filteredSessions.map((session) => ({
        ...session,
        color: session.workout_type === "benchpress" ? "blue" : "red", // 예시로 색상 추가
    }));

    // Firestore에서 운동 세션 데이터 가져오기
    const fetchWorkoutSessions = async () => {
        if (!userId) return;
        try {
            const q = query(
                collection(firestore, "workout_sessions"),
                where("user_id", "==", userId)
            );
            const snapshot = await getDocs(q);
            const sessions = snapshot.docs.map((doc) => doc.data() as WorkoutSession);
            setWorkoutSessions(sessions);

            // 꺾은선 차트 데이터 생성
            const aggregatedData = sessions.reduce((acc, session) => {
                const date = session.date.split("-").slice(0, 3).join("-"); // "YYYY-MM-DD" 형식으로 변환
                acc[date] = (acc[date] || 0) + session.sets.length; // 세트 길이 누적
                return acc;
            }, {} as { [key: string]: number });

            setLineChartData({
                labels: Object.keys(aggregatedData), // 날짜 배열
                datasets: [
                    {
                        label: "날짜별 총 세트 수",
                        data: Object.values(aggregatedData), // 세트 수 배열
                        borderColor: "#4F46E5",
                        backgroundColor: "#4F46E5",
                        tension: 0.1,
                        fill: false,
                    },
                ],
            });
        } catch (error) {
            console.error("운동 세션 가져오기 오류:", error);
            setError("운동 세션 데이터를 가져오는 중 오류가 발생했습니다.");
        }
    };

    // 선택한 날짜에 따라 세션 필터링
    useEffect(() => {
        if (selectedDate) {
            let selectedDateUTC: Date;

            // 선택된 날짜가 Date 객체인지 확인하고 UTC 변환
            if (typeof selectedDate === "string") {
                selectedDateUTC = new Date(selectedDate + "T00:00:00Z");
            } else {
                selectedDateUTC = new Date(
                    Date.UTC(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                    )
                );
            }

            const filtered = workoutSessions.filter((session) => {
                const sessionDate = session.date.split("-").slice(0, 3).join("-");
                const sessionDateUTC = new Date(sessionDate + "T00:00:00Z"); // Firestore 날짜를 UTC로 변환
                return sessionDateUTC.getTime() === selectedDateUTC.getTime();
            });

            setFilteredSessions(filtered);
        }
    }, [selectedDate, workoutSessions]);



    // Firestore 데이터를 가져오기
    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            Promise.all([fetchUserName(), fetchWorkoutSessions()])
                .then(() => setError(null))
                .finally(() => setIsLoading(false));
        } else {
            setUserName(null);
            setWorkoutSessions([]);
        }
    }, [userId]);

    // 데이터 로딩 중일 때 메시지 출력
    if (isLoading) {
        return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;
    }

    // 오류 발생 시 오류 메시지 출력
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
            <div className="min-h-screen max-w-screen bg-gray-100 p-6 grid grid-cols-12 gap-6">
                {/* 사이드바 영역 */}
                <aside className="col-span-3 bg-white rounded-lg shadow p-4 flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">운동 날짜 선택</h2>
                    <CustomCalendar
                        selectedDate={selectedDate}
                        onDateChange={(date) => setSelectedDate(date)} // 날짜 변경 시 상태 업데이트
                    />
                </aside>

                {/* 메인 콘텐츠 영역 */}
                <main className="col-span-9 space-y-8">
                    <header className="bg-white p-4 rounded-lg shadow mb-6">
                        <h1 className="text-3xl font-bold mb-2">안녕하세요 ! {userName || "회원"}님 👋</h1>
                        <p className="text-xl "> 오늘도 운동하러 오셨군요!</p>
                    </header>

                    {/* 차트 컴포넌트 */}
                    <Chart
                        workoutData={enrichedSessions}
                        targetReps={targetReps}
                        onUpdateTargetReps={(workoutType, newTarget) =>
                            setTargetReps((prev) => ({ ...prev, [workoutType]: newTarget }))
                        }
                        lineChartData={lineChartData}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
