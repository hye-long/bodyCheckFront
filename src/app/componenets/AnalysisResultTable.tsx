import React from "react";

// 예측 결과를 표 형태로 렌더링하는 컴포넌트
const AnalysisResultTable = ({ analysisResult }: { analysisResult: number[] | null }) => {
    const bodyMeasurementLabels = [
        "목뒤높이", "엉덩이높이", "겨드랑높이", "허리높이", "샅높이", "무릎높이",
        "머리둘레", "목둘레", "젖가슴둘레", "허리둘레", "배꼽수준 허리둘레", "엉덩이둘레",
        "넓다리둘레", "무릎둘레", "장딴지둘레", "종아리 최소둘레", "발목둘레", "편평복사둘레",
        "손목둘레", "위팔길이", "팔길이", "어깨사이 너비", "머리수직길이", "얼굴수직 길이",
        "발크기", "발너비", "얼굴 너비", "손 직선 길이", "손바닥 직선길이", "손 안쪽 각주 직선 길이",
    ];

    if (!analysisResult || analysisResult.length === 0) {
        return <p>분석 결과가 없습니다.</p>;
    }

    const maxLength = Math.min(bodyMeasurementLabels.length, analysisResult.length);

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-4 max-h-[800px] overflow-y-auto overflow-x-auto">
            <h3 className="text-lg font-bold mt-15 mb-4">예측 결과</h3>
            <div className="overflow-y-auto max-h-[500px]">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">항목</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">값</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bodyMeasurementLabels.slice(0, maxLength).map((label, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{label}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                                {typeof analysisResult[index] === "number"
                                    ? analysisResult[index].toFixed(2)
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalysisResultTable;
