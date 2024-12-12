'use client';

import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

interface WorkoutSet {
    reps: number;
}

interface WorkoutSession {
    workout_type: string;
    sets: WorkoutSet[];
    date: string;
    color:string;
}

interface ChartProps {
    workoutData: WorkoutSession[];
    targetReps: { [key: string]: number };
    onUpdateTargetReps: (workoutType: string, newTarget: number) => void;
    lineChartData: any; // 꺾은선 차트
}

const Chart: React.FC<ChartProps> = ({
                                         workoutData,
                                         targetReps,
                                         onUpdateTargetReps,
                                         lineChartData,
                                     }) => {
    // 원형 차트 데이터 생성 함수
    const createDoughnutData = (completed: number, target: number) => ({
        labels: ['완료된 반복', '남은 반복'],
        datasets: [
            {
                data: [completed, Math.max(0, target - completed)],
                backgroundColor: ['#4F46E5', '#E5E7EB'],
                borderWidth: 0,
            },
        ],
    });

    return (
        <div className="space-y-6 justify-between ">
            {/* 원형 차트 */}
            {['benchpress', 'squat', 'deadlift'].map((workoutType) => {
                const session = workoutData.find(
                    (data) => data.workout_type === workoutType
                );
                const sets = session?.sets || []; // 세트 데이터가 없으면 빈 배열

                const target = targetReps[workoutType] || 10;

                return (
                    <div
                        key={workoutType}
                        className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-12"
                    >
                        <h3 className="text-2lg justify-between font-bold text-gray-700 text-center sm:text-left">
                            {workoutType}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            {/* 최대 3개의 세트를 표시 */}
                            {Array.from({ length: 3 }).map((_, index) => {
                                const reps = sets[index]?.reps || 0; // 해당 세트가 없으면 reps는 0
                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="relative w-28 h-28">
                                            <Doughnut
                                                data={createDoughnutData(reps, target)}
                                                options={{
                                                    cutout: '75%',
                                                    plugins: {
                                                        tooltip: { enabled: true },
                                                        legend: { display: false },
                                                    },
                                                }}
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <p className="text-lg font-bold">{reps}</p>
                                                <p className="text-sm text-gray-500">/ {target}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2">{index + 1}세트</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 목표치 설정 */}
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                className="border rounded p-1 text-center w-16 mb-2"
                                value={target}
                                onChange={(e) =>
                                    onUpdateTargetReps(workoutType, parseInt(e.target.value, 10))
                                }
                            />
                            <button
                                className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
                                onClick={() => onUpdateTargetReps(workoutType, target)}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* 꺾은선 차트 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-gray-700">날짜별 운동 기록</h3>
                <div className="w-full h-[400px]">
                    <Line
                        data={lineChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true, // 범례 표시
                                    position: 'top',
                                },
                            },
                            scales: {
                                x: {
                                    type: 'category', // X축의 유형
                                    title: {
                                        display: true,
                                        text: '날짜', // X축 제목
                                    },
                                    grid: {
                                        display: true, // 그리드 라인 표시
                                    },
                                },
                                y: {
                                    beginAtZero: true, // Y축이 0부터 시작
                                    max: 3,
                                    min:0,
                                    title: {
                                        display: true,
                                        text: '세트 수', // Y축 제목
                                    },
                                    grid: {
                                        display: true, // 그리드 라인 표시
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chart;
