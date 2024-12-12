'use client';
import React, { useRef } from "react";
import { useObserver } from "../utils/useObserver";

const WhySection: React.FC = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const { isVisible: isVisible1 } = useObserver({ target: ref1, option: { threshold: 0.4 } });
    const { isVisible: isVisible2 } = useObserver({ target: ref2, option: { threshold: 0.8 } });
    const { isVisible: isVisible3 } = useObserver({ target: ref3, option: { threshold: 0.9 } });

    return (
        <div className="flex  justify-between items-start px-[10svw]  py-[20vh] bg-black text-white h-1/4 box-border">
            {/* 텍스트 섹션 */}
            <div className="flex-1 max-w-[70%] lg:max-w-[50%] mb-[5vh] lg:mb-0">
                <h2 className="text-[6vw] font-bold mb-[2vh]">WHY?</h2>
                <p className="text-[2vw] leading-[1.8]">
                    운동의 중요성은 알지만 어떤 운동을 시작해야 할지 막막한 당신을 위해<br />
                    극한의 효율을 중시하는 현대인들에게 도움이 되고자 합니다.
                </p>
            </div>

            {/* 버블 섹션 */}
            <div className="flex-1 flex flex-col items-center gap-[5vh]">
                {/* 첫 번째 버블 */}
                <div
                    ref={ref1}
                    className={`relative w-[20vw] h-[20vw] bg-gray-300 text-black p-[5vw] rounded-full flex items-center justify-center text-[1.2vw] font-normal text-center leading-[1] transition-transform duration-600 ${
                        isVisible1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5%]"
                    }`}
                >
                    어떻게 운동을 해야할지 막막해요
                </div>

                {/* 두 번째 버블 행 */}
                <div className="flex gap-[3vw]">
                    <div
                        ref={ref2}
                        className={`w-[20vw] h-[20vw] bg-gray-600 text-white rounded-full p-[3vw] flex items-center justify-center text-[1.2vw] font-normal text-center leading-[1.5] transition-transform duration-600 ${
                            isVisible2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5%]"
                        }`}
                    >
                        내가 직접 운동을 하면서<br />바로바로 피드백을 받고 싶어요
                    </div>
                    <div
                        ref={ref3}
                        className={`w-[20vw] h-[20vw] bg-white text-black rounded-full p-[3vw] flex items-center justify-center text-[1.2vw] font-normal text-center leading-[1.5] transition-transform duration-600 ${
                            isVisible3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5%]"
                        }`}
                    >
                        내가 직접 운동을 하면서<br />바로바로 피드백을 받고 싶어요
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhySection;
