"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SingleBarChartProps {
    label: string; // 데이터 항목 이름
    value: number; // 데이터 값
    color: string; // 막대 색상
    maxScale?: number; // x축 최대 값
    stepSize?: number; // x축 간격
}

const SingleBarChart: React.FC<SingleBarChartProps> = ({
                                                           label,
                                                           value,
                                                           color,
                                                           maxScale = 50,
                                                           stepSize = 5,
                                                       }) => {
    const chartData = {
        labels: [label],
        datasets: [
            {
                label,
                data: [value],
                backgroundColor: [color],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow manual height/width adjustment
        indexAxis: "y" as const, // 가로 막대형 차트
        plugins: {
            legend: {
                display: false, // 범례 숨김
            },
        },
        scales: {
            x: {
                beginAtZero: true, // x축 0부터 시작
                max: maxScale, // x축 최대 값
                ticks: {
                    stepSize, // x축 간격
                    font: {
                        size: 10, // x축 폰트 크기 조정
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 10, // y축 폰트 크기 조정
                    },
                },
            },
        },
    };

    return (
        <div
            className="w-full my-4 shadow-lg"
            style={{ height: "100px" }} // Adjust the height of the chart container
        >
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default SingleBarChart;
