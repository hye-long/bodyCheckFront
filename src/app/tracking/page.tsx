"use client";

import React from "react";
import DashboardLayout from "@/app/componenets/dashboardLayout";

export default function RecordingExercise() {
    const handleRedirect = () => {
        // 서버 연결 URL을 새 탭에서 열기
        window.open("https://www.juhwan.store/", "_blank");
    };

    return (
        <DashboardLayout>
            {/* 콘텐츠 */}
            <div className="flex flex-wrap h-auto bg-gray-100 overflow-hidden">
                {/* 설명 영역 (왼쪽) */}
                <div className="flex-1 p-[5vw]">
                    <h1 className="text-[3vw] font-bold mb-[3vw] mt-[20vh] md:mt-[10vh]">BODY : CHECK</h1>
                    <p className="text-[2vw] leading-relaxed mb-[5vw] text-gray-800">
                        이제 운동할 준비가 되셨나요?<br/>
                        <strong>BODY : CHECK</strong>는 실시간으로 운동을 체크해드려요.
                    </p>
                    {/* 서버 연결 버튼 */}
                    <button
                        onClick={handleRedirect}
                        className="px-[3vw] py-[2vw] md:h-[vh] bg-black text-white rounded-full text-[2vw] hover:bg-gray-800 transition"
                    >
                        서버 연결
                    </button>
                </div>

                {/* 버튼과 텍스트 영역 (오른쪽) */}
                <div className="flex-1 text-center mt-[20vw] md:mt-[10vh] md:mb-[3vh]">
                    {/* 가이드 영역 */}
                    <div className="grid grid-cols-2 gap-[8vw]  lg:gap-[2vw] md:gap-[2vw]">
                        {/* 각 단계 */}
                        {[
                            { step: "1", text: "운동종목 선택하기" },
                            { step: "2", text: "운동 시작 누르기" },
                            { step: "3", text: "실시간으로 운동 체크하기 " },
                            { step: "4", text: "웹페이지로 돌아와 기록 확인" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`flex flex-col items-center justify-center border-2 border-black rounded-full w-[20vw] h-[20vh] md:-[23vw] md:h-[40vh] mx-auto text-center ${
                                    ["2", "3"].includes(item.step) ? "bg-black text-white" : "bg-transparent text-black"
                                }`}
                            >
                                <span className="text-[2vw] mb-[2vw]">{item.step}</span>
                                <span className="text-[2vw] ">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
