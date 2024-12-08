import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore"; // Zustand 스토어 사용

// BMI 계산 함수
const calculateBMI = (height: number, weight: number): number => {
    if (height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100; // cm를 m로 변환
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

// 체지방률 계산 함수
const calculateBodyFat = (bmi: number, age: number, gender: string): number => {
    if (bmi <= 0 || age <= 0) return 0;

    //  체지방률 계산 공식 (성별 차이를 반영)
    return parseFloat(
        (
            gender === "남성"
                ? 1.2 * bmi + 0.23 * age - 16.2
                : 1.2 * bmi + 0.23 * age - 5.4
        ).toFixed(2)
    );
};

const BMICalculator: React.FC = () => {
    const { userData, updateUser } = useUserStore(); // Zustand에서 사용자 데이터와 업데이트 함수 가져오기
    const [bmi, setBMI] = useState<number | null>(null); // BMI 상태
    const [bodyFat, setBodyFat] = useState<number | null>(null); // 체지방률 상태

    useEffect(() => {
        const calculateAndUpdateMetrics = async () => {
            if (userData && userData.height > 0 && userData.weight > 0 && userData.age > 0) {
                // BMI 계산
                const calculatedBMI = calculateBMI(userData.height, userData.weight);
                setBMI(calculatedBMI);

                // 체지방률 계산
                const calculatedBodyFat = calculateBodyFat(calculatedBMI, userData.age, userData.gender);
                setBodyFat(calculatedBodyFat);

                // Firestore 및 Zustand 업데이트
                try {
                    if (userData.id) {
                        await updateUser(userData.id, {
                            bmi: calculatedBMI,
                            bodyFat: calculatedBodyFat,
                        });
                        console.log("Firestore에 BMI와 체지방률이 업데이트되었습니다:", {
                            bmi: calculatedBMI,
                            bodyFat: calculatedBodyFat,
                        });
                    } else {
                        console.error("유효하지 않은 사용자 ID:", userData.id);
                    }
                } catch (error) {
                    console.error("Firestore 업데이트 중 오류 발생:", error);
                }
            } else {
                console.warn("사용자 데이터가 올바르지 않습니다. 키와 몸무게, 나이를 확인하세요.");
            }
        };

        calculateAndUpdateMetrics();
    }, [userData, updateUser]);

    return (
        <div className="p-4">

        </div>
    );
};

export default BMICalculator;
