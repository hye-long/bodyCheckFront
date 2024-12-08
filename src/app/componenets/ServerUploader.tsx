// 서버에 보내서 정보 받아오는 거..

"use client";

import React, { useState } from "react";

interface ServerUploaderProps {
    onResult: (result: number[]) => void; // 분석 결과 콜백
    onUpload?: (imageUrl: string) => void; // 이미지 URL 업로드 콜백 (옵션)
    bodyMeasurementLabels: string[]; // 측정 항목 레이블
}

const ServerUploader: React.FC<ServerUploaderProps> = ({ onResult, onUpload, bodyMeasurementLabels }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleServerUpload = async (imageUrl: string, height: number, bmi: number) => {
        const formData = new FormData();
        formData.append("imageUrl", imageUrl);
        formData.append("height", height.toString());
        formData.append("bmi", bmi.toString());

        try {
            setIsLoading(true);
            const response = await fetch("/predict", { method: "POST", body: formData });

            if (response.ok) {
                const data = await response.json();
                onResult(data.result); // 분석 결과 전달
            } else {
                console.error("서버에서 데이터를 가져오는 중 오류 발생");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading ? (
                <div className="text-gray-500 text-center my-4">분석 중...</div>
            ) : (
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">항목</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">값</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bodyMeasurementLabels.map((label, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{label}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">N/A</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ServerUploader;
