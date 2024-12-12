import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firestore/firebase";
import useSignupStore from "@/store/useSignupStore";

// 비밀번호 유효성 검사 함수
export const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
    return passwordRegex.test(password);
};

// 비밀번호 일치 검사 함수
export const arePasswordsMatching = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

// 아이디 중복 확인 함수
export const checkIdAvailability = async (id: string): Promise<boolean> => {
    const docRef = doc(firestore, "users", id);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists(); // 존재하지 않으면 true 반환
};

// 회원가입 핸들러
export const handleSignup = async (e: React.FormEvent, router: any) => {
    e.preventDefault();
    const {
        id,
        password,
        confirmPassword,
        age,
        name,
        types,
        gender,
        address,
        height,
        weight,
        bmi,
        isIdUnique,
        setField,
    } = useSignupStore.getState();

    if (!isPasswordValid(password)) {
        alert("비밀번호는 영문 소문자와 숫자를 포함하여 8자리 이상이어야 합니다.");
        return;
    }

    if (!arePasswordsMatching(password, confirmPassword)) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    if (!isIdUnique) {
        alert("아이디 중복 확인을 해주세요.");
        return;
    }

    try {
        const calculatedBMI = weight / ((height / 100) ** 2);

        await setDoc(doc(firestore, "users", id), {
            id,
            name,
            gender,
            address,
            password,
            types,
            height,
            weight,
            bmi: parseFloat(calculatedBMI.toFixed(2)),
            age,
        });

        setField("isSignupComplete", true);
        alert("회원가입이 완료되었습니다.");
        router.push("/Login");
    } catch (error) {
        console.error("회원가입 실패:", error);
        alert("회원가입 중 오류가 발생했습니다.");
    }
};
