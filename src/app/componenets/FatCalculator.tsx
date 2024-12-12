export const FatCalculator = (
    weight: number,
    height: number,
    gender: string,
    age: number
) => {
    // 입력값 유효성 검사
    if (!weight || !height) {
        throw new Error("유효하지 않은 몸무게나 키 값");
    }

    // 1. BMI 계산
    const bmi = weight / ((height / 100) ** 2);
    const roundedBMI = Number(bmi.toFixed(2)); // 소수점 2자리로 반올림

    // 2. 체지방률 계산
    const fatPercentage =
        gender === "남"
            ? 1.2 * roundedBMI + 0.23 * age - 16.2
            : 1.2 * roundedBMI + 0.23 * age - 5.4;
    const roundedFatPercentage = Number(fatPercentage.toFixed(2)); // 소수점 2자리로 반올림

    // 3. 제지방량 계산
    const leanBodyMass = weight * (1 - roundedFatPercentage / 100);
    const roundedLeanBodyMass = Number(leanBodyMass.toFixed(2));

    // 4. 반환값
    return {
        bmi: roundedBMI,
        fatPercentage: roundedFatPercentage,
        leanBodyMass: roundedLeanBodyMass,
        fatMass: Number((weight - roundedLeanBodyMass).toFixed(2)), // 체지방량
    };
};
