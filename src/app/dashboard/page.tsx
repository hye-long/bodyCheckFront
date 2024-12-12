"use client";

import React, { useEffect, useState } from "react";
import { getWorkoutSessionsByUser, getUserNameById } from "@/app/firestore/firestore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import Chart from "@/app/componenets/Chart";
import CustomCalendar from "../componenets/CustomCalendar";
import "react-datepicker/dist/react-datepicker.css";

// 운동 세트 인터페이스
interface WorkoutSet {
    reps: number;
    weight: string;
}

// 운동 세션 인터페이스
interface WorkoutSession {
    workout_type: string;
    sets: WorkoutSet[];
    date: string;
    color?: string;
}

const Dashboard = () => {
    const userId = useAuthStore((state) => state.userId); // Zustand에서 userId 가져오기
    const [userName, setUserName] = useState<string | null>(null);
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<WorkoutSession[]>([]);
    const [lineChartData, setLineChartData] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | string>(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [targetReps, setTargetReps] = useState<{ [key: string]: number }>({
        benchpress: 10,
        squat: 10,
        deadlift: 10,
    });

    // 사용자 이름 가져오기
    const fetchUserName = async () => {
        if (!userId) return;
        try {
            const name = await getUserNameById(userId);
            setUserName(name);
        } catch (error) {
            console.error("사용자 이름 가져오기 실패:", error);
            setError("사용자 정보를 가져오는 중 문제가 발생했습니다.");
        }
    };

    // 운동 세션 가져오기
    const fetchWorkoutSessions = async () => {
        if (!userId) return;
        try {
            const sessions = await getWorkoutSessionsByUser(userId);
            setWorkoutSessions(sessions);

            // 꺾은선 차트 데이터 생성
            const aggregatedData = sessions.reduce((acc, session) => {
                const date = session.date.split("-").slice(0, 3).join("-");
                acc[date] = (acc[date] || 0) + session.sets.length;
                return acc;
            }, {} as { [key: string]: number });

            setLineChartData({
                labels: Object.keys(aggregatedData),
                datasets: [
                    {
                        label: "날짜별 총 세트 수",
                        data: Object.values(aggregatedData),
                        borderColor: "#4F46E5",
                        backgroundColor: "#4F46E5",
                        tension: 0.1,
                        fill: false,
                    },
                ],
            });
        } catch (error) {
            console.error("운동 세션 가져오기 실패:", error);
            setError("운동 데이터를 가져오는 중 문제가 발생했습니다.");
        }
    };

    // 선택 날짜에 따라 세션 필터링
    useEffect(() => {
        if (selectedDate) {
            const selectedDateUTC = new Date(
                typeof selectedDate === "string"
                    ? `${selectedDate}T00:00:00Z`
                    : Date.UTC(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                    )
            );

            const filtered = workoutSessions.filter((session) => {
                const sessionDateUTC = new Date(`${session.date}T00:00:00Z`);
                return sessionDateUTC.getTime() === selectedDateUTC.getTime();
            });

            setFilteredSessions(filtered);
        }
    }, [selectedDate, workoutSessions]);

    // 목표 반복 횟수 업데이트
    const handleUpdateTargetReps = (workoutType: string, newTarget: number) => {
        setTargetReps((prev) => ({
            ...prev,
            [workoutType]: newTarget,
        }));
    };

    // Firestore 데이터 로드
    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            Promise.all([fetchUserName(), fetchWorkoutSessions()])
                .then(() => setError(null))
                .finally(() => setIsLoading(false));
        } else {
            setUserName(null);
            setWorkoutSessions([]);
            setIsLoading(false);
        }
    }, [userId]);

    // 로딩 상태
    if (isLoading) {
        return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;
    }

    // 오류 발생 시
    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>오류가 발생했습니다: {error}</p>
            </div>
        );
    }

    // UI 렌더링
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-12 gap-6">
                {/* 사이드바 */}
                <aside className="col-span-3 bg-white rounded-lg shadow p-4 flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">운동 날짜 선택</h2>
                    <CustomCalendar
                        selectedDate={selectedDate}
                        onDateChange={(date) => setSelectedDate(date)}
                    />
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="col-span-9 space-y-8">
                    <header className="bg-white p-4 rounded-lg shadow mb-6">
                        <h1 className="text-3xl font-bold mb-2">
                            안녕하세요! {userName || "회원"}님 👋
                        </h1>
                        <p className="text-xl">오늘도 운동하러 오셨군요!</p>
                    </header>

                    {/* 차트 */}
                    <Chart
                        workoutData={filteredSessions.map((session) => ({
                            ...session,
                            color:
                                session.workout_type === "benchpress"
                                    ? "blue"
                                    : session.workout_type === "squat"
                                        ? "green"
                                        : "red",
                        }))}
                        targetReps={{ benchpress: 10, squat: 10, deadlift: 10 }}
                        lineChartData={lineChartData}
                        onUpdateTargetReps={handleUpdateTargetReps}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
