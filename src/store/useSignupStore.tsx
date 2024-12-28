import { create } from "zustand";

export interface SignupFormState {
    id: string;
    password: string;
    confirmPassword: string;
    name: string;
    types: string;
    gender: string;
    address: string;
    height: number;
    weight: number;
    age: number;
    bmi: number | null; // BMI 값
    isIdUnique: boolean | null; // 아이디 중복 확인 여부
    isSignupComplete: boolean;
    passwordError: string | null; // 비밀번호 오류 메시지
    confirmPasswordError: string | null; // 비밀번호 확인 오류 메시지
    setField: <T extends keyof SignupFormState>(field: string, value: SignupFormState[T]) => void;
    validatePasswords: () => void; // 비밀번호 유효성 검사 함수
}

export const useSignupStore = create<SignupFormState>((set) => ({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    types: "",
    gender: "",
    address: "",
    height: 0,
    weight: 0,
    age: 0,
    bmi: null,
    detailedAddress: null,

    isIdUnique: null,
    isSignupComplete: false,
    passwordError: null,
    confirmPasswordError: null,

    setField: <T extends keyof SignupFormState>(field: T, value: SignupFormState[T]) =>
        set((state) => ({
            ...state,
            [field]: value,
        })),

    validatePasswords: () =>
        set((state) => {
            const passwordError =
                state.password.length < 6 ? "비밀번호는 6자 이상이어야 합니다." : null;
            const confirmPasswordError =
                state.password !== state.confirmPassword ? "비밀번호가 일치하지 않습니다." : null;

            return {
                ...state,
                passwordError,
                confirmPasswordError,
            };
        }),
}));

export default useSignupStore;
