export default function BodySystemSection() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black px-24 text-center">
            {/* 텍스트 섹션 */}
            <div className="mb-10 w-full flex flex-col items-center justify-center">
                <h2 className="text-[3.5vw] font-bold mb-[6vh] text-white pl-[2vw]">
                    어디에도 없던 사진 한장의 눈바디 시스템
                </h2>
                <p className="text-[2vw] text-white leading-[1.5] max-w-[70vw] mt-1 mb-2">
                    눈으로 보이는 체형의 문제점을 AI가 알려드립니다.
                </p>
                <p className="text-[2vw] text-white leading-[1.5] max-w-[70vw] mt-1 mb-2">
                    옷을 벗지 않고, 사진 한 장으로 체형을 분석해 드릴게요.c
                </p>
            </div>

            {/* 이미지 섹션 */}
            <div className="mt-10 w-full h-auto">
                <img
                    src="/images/checkbody.png"
                    alt="눈바디 시스템 이미지"
                    className="w-full h-full object-cover rounded-lg mb--3"
                />
            </div>
        </div>
    );
}
