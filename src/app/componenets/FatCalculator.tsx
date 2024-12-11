export const FatCalculator = (
    weight: number,
    height: number,
    gender: string,
    age: number
): {
    bmi: number;
    fatPercentage: number;
    leanBodyMass: number;
    fatMass: number;
} | null => {
    if (!weight || !height) {
        console.warn("유효하지 않은 몸무게나 키 값");
        return null;
    }

    // 1. BMI 계산
    const bmi = weight / ((height / 100) ** 2);
    const roundedBMI = Number(bmi.toFixed(2));

    // 2. 체지방률 계산
    const fatPercentage =
        gender === "남"
            ? (1.2 * roundedBMI) + (0.23 * age) - 16.2
            : (1.2 * roundedBMI) + (0.23 * age) - 5.4;
    const roundedFatPercentage = Number(fatPercentage.toFixed(2));

    // 3. 제지방량 계산
    const leanBodyMass = weight * (1 - roundedFatPercentage / 100);
    const roundedLeanBodyMass = Number(leanBodyMass.toFixed(2));

    return {
        bmi: roundedBMI,
        fatPercentage: roundedFatPercentage,
        leanBodyMass: roundedLeanBodyMass,
        fatMass: Number((weight - roundedLeanBodyMass).toFixed(2)), // 체지방량
    };
};
