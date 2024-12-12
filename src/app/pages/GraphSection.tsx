'use client';
import React from "react";

export default function GraphSection() {
    return (
        <div className="relative flex flex-col items-center justify-center text-center h-[100vh] bg-white overflow-hidden">
            {/* 텍스트 섹션 */}
            <div className="absolute top-[5vh] z-20 text-center">
                <h2 className="text-[4vw] text-black font-bold">한눈에 보는 그래프</h2>
                <p className="text-black text-[2.5vw] mt-5 leading-relaxed max-w-[60vw] mx-auto mb-3vh">
                    수치화된 통계 데이터로 몸의 변화를 보여드릴게요.
                </p>
            </div>

            {/*
            이거 전체 컴퓨터 프레임인데 안넣어도 될 것 같아서 일다 뺌...
            피드백 이후 다시 반영
             <div className="relative z-10 w-[850px] h-[450px] mt-[50px]">
                <img
                    src="/images/macbookb.png"
                    alt="컴퓨터 프레임"
                    className="absolute w-full h-full object-contain"
                />
              </div>
             */}



            {/* 사진 애니메이션 */}
            <div className="absolute bottom-0 left-0 w-full h-[600px] overflow-hidden">
                <div className="absolute flex items-center h-full w-[100%] animate-slide-images">
                    {[
                        "/images/graph1.png",
                        "/images/graph2.png",
                        "/images/graph3.png",
                        "/images/graph4.png",
                        "/images/image29.png",
                    ].map((src, index) => (
                        <div
                            key={index}
                            className="w-[1000px] h-full flex-shrink-0 flex items-center justify-center"
                        >
                            <img
                                src={src}
                                alt={`Graph ${index + 1}`}
                                className="h-full w-auto object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
