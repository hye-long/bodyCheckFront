import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

const BMICalculator: React.FC = () => {
    const { userData, updateUser } = useUserStore();
    const [bmi, setBMI] = useState<number | null>(null);

    useEffect(() => {
        const calculateAndSaveBMI = async () => {
            if (!userData || userData.height <= 0 || userData.weight <= 0) {
                console.warn("유효하지 않은 사용자 데이터");
                return;
            }

            const calculatedBMI = userData.weight / ((userData.height / 100) ** 2);
            const roundedBMI = parseFloat(calculatedBMI.toFixed(2));
            setBMI(roundedBMI);

            try {
                await updateUser(userData.id, { bmi: roundedBMI });
                console.log("Firestore에 BMI 업데이트 완료:", roundedBMI);
            } catch (error) {
                console.error("Firestore 업데이트 중 오류 발생:", error);
            }
        };

        calculateAndSaveBMI();
    }, [userData, updateUser]);

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold">BMI 계산기</h3>
            <p>BMI: {bmi !== null ? bmi : "계산 중..."}</p>
        </div>
    );
};

export default BMICalculator;
