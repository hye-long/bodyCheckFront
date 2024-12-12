'use client';

import React, { useRef } from "react";
import { useObserver } from "../utils/useObserver";

export default function RecordSection() {
    const imageRef = useRef(null);
    const textRef = useRef(null);

    const { isVisible: isImageVisible } = useObserver({ target: imageRef, option: { threshold: 0.3 } });
    const { isVisible: isTextVisible } = useObserver({ target: textRef, option: { threshold: 0.3 } });

    return (
        <div className="flex flex-row items-center justify-between sm:h-[30vh] md:h-[90vh] bg-gray-400 overflow-hidden ">
            {/* 이미지 섹션 */}
            <div
                ref={imageRef}
                className={`relative flex items-center justify-end w-[60%] transition-opacity duration-1000 ease-out transform ${
                    isImageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[5vw]"
                }`}
            >
                <div className="absolute top-0 right-0 left-0 w-full h-full rounded-lg "></div>
                <img
                    src="/images/sportsmockup.png"
                    alt="운동 측정 이미지 1"
                    className="w-full h-full left-0 object-contain"
                />
            </div>

            {/* 텍스트 섹션 */}
            <div
                ref={textRef}
                className={`flex-1 flex flex-col items-end justify-center pr-[5vw] text-right w-[80vw] transition-opacity duration-1000 ease-out transform ${
                    isTextVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[5vw]"
                }`}
            >
                <h2 className="text-[3.5vw] text-black font-bold mb-[2vh]">
                    직접 기록해야 하는 번거로움은 낮췄습니다.
                </h2>
                <p className="text-[2vw] text-black leading-[1.6] whitespace-pre-line">
                    이제 내 움직임을
                    자동으로 측정하여
                    더 편리하게 운동 기록을 측정해보세요.
                </p>
            </div>
        </div>
    );
}
