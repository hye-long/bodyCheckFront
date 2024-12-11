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
    const login = useAuthStore((state) => state.login); // Zustand 로그인 함수
    const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 상태
    const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]); // 운동 세션 상태
    const [selectedDate, setSelectedDate] = useState<Date | string>(new Date()); // 선택한 날짜
    const [filteredSessions, setFilteredSessions] = useState<WorkoutSession[]>([]); // 필터링된 운동 세션
    const [lineChartData, setLineChartData] = useState<any>({ labels: [], datasets: [] }); // 꺾은선 차트 데이터
    const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지

    useEffect(() => {
        // userId가 없으면 로그인 페이지로 리다이렉트
        if (!userId) {
            console.warn("로그인 상태가 아닙니다.");
        }
    }, [userId]);

    // Firestore에서 사용자 이름 가져오기
    const fetchUserName = async () => {
        if (!userId) return;
        try {
            const userDoc = await getDoc(doc(firestore, "users", userId));
            if (userDoc.exists()) {
                setUserName(userDoc.data().name || "회원");
            } else {
                console.warn("사용자 정보를 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("사용자 이름 가져오기 오류:", err);
            setError("사용자 이름 가져오기 중 문제가 발생했습니다.");
        }
    };

    // Firestore에서 운동 세션 가져오기
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
        } catch (err) {
            console.error("운동 세션 가져오기 오류:", err);
            setError("운동 세션 가져오기 중 문제가 발생했습니다.");
        }
    };

    // 선택한 날짜에 따라 세션 필터링
    useEffect(() => {
        if (workoutSessions.length === 0) return;

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
    }, [selectedDate, workoutSessions]);

    // 꺾은선 차트 데이터 생성
    useEffect(() => {
        if (workoutSessions.length === 0) return;

        const aggregatedData = workoutSessions.reduce((acc, session) => {
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
    }, [workoutSessions]);

    // Firestore 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                console.warn("userId가 없습니다. 데이터를 가져오지 않습니다.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                await Promise.all([fetchUserName(), fetchWorkoutSessions()]);
            } catch (err) {
                console.error("데이터 로드 오류:", err);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // 데이터 로딩 중일 때 표시
    if (isLoading) {
        return <p className="text-center text-gray-500">데이터를 불러오는 중입니다...</p>;
    }

    // 오류 발생 시 표시
    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const enrichedSessions = filteredSessions.map((session) => ({
        ...session,
        color: session.workout_type === "benchpress" ? "blue" : "red",
    }));

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-12 gap-6">
                <aside className="col-span-3 bg-white rounded-lg shadow p-4 flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">운동 날짜 선택</h2>
                    <CustomCalendar
                        selectedDate={selectedDate}
                        onDateChange={(date) => setSelectedDate(date)}
                    />
                </aside>
                <main className="col-span-9 space-y-8">
                    <header className="bg-white p-4 rounded-lg shadow">
                        <h1 className="text-3xl font-bold">안녕하세요, {userName || "회원"}님!</h1>
                    </header>
                    <Chart
                        workoutData={enrichedSessions}
                        targetReps={{ benchpress: 10, squat: 10, deadlift: 10 }}
                        onUpdateTargetReps={(workoutType, newTarget) =>
                            console.log(`Updated ${workoutType} target to ${newTarget}`)
                        }
                        lineChartData={lineChartData}
                    />
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
