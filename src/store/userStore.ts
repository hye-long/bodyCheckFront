// src/store/userStore.ts
import { create } from "zustand";
import { validateUser } from "../app/firestore/auth";
import { getUserData, updateUserData } from "@/app/firestore/firestore";
import { FatCalculator } from "@/app/componenets/FatCalculator";

export interface UserData {
    id: string;
    name: string;
    password: string;
    gender: string;
    age: number;
    types: string;
    height: number;
    weight: number;
    address: string;
    bmi: number;
    fat: number;
}

interface UserState {
    userData: UserData | null; // 사용자 데이터
    isAuthenticated: boolean; // 인증 상태
    isLoading: boolean; // 로딩 상태
    login: (id: string, password: string) => Promise<boolean>; // 로그인 함수
    logout: () => void; // 로그아웃 함수
    fetchUser: (userId: string) => Promise<void>; // Firestore 사용자 데이터 로드
    updateUser: (userId: string, updatedFields: Partial<UserData>) => Promise<void>; // Firestore 사용자 데이터 업데이트
    calculateAndUpdateMetrics: () => Promise<void>; // BMI 및 체지방률 계산 및 업데이트
}

export const useUserStore = create<UserState>((set, get) => ({
    userData: null,
    isAuthenticated: false,
    isLoading: false,

    // 로그인 처리
    login: async (id: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
            const user = await validateUser(id, password); // Firestore에서 사용자 검증
            if (user) {
                set({ userData: user, isAuthenticated: true, isLoading: false });
                return true; // 로그인 성공
            }
            set({ isAuthenticated: false, isLoading: false });
            return false; // 로그인 실패
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            set({ isAuthenticated: false, isLoading: false });
            return false;
        }
    },

    // 로그아웃 처리
    logout: () => {
        set({ userData: null, isAuthenticated: false });
    },

    // Firestore에서 사용자 데이터 로드
    fetchUser: async (userId: string) => {
        set({ isLoading: true });
        try {
            const data = await getUserData(userId);
            if (data) {
                set({ userData: data, isLoading: false });
            } else {
                set({ userData: null, isLoading: false });
            }
        } catch (error) {
            console.error("사용자 데이터 로드 오류:", error);
            set({ isLoading: false });
        }
    },

    // Firestore에서 사용자 데이터 업데이트
    updateUser: async (userId: string, updatedFields: Partial<UserData>) => {
        try {
            await updateUserData(userId, updatedFields);
            set((state) => ({
                userData: { ...state.userData, ...updatedFields } as UserData,
            }));
        } catch (error) {
            console.error("상태 업데이트 오류:", error);
        }
    },

    // BMI 및 체지방률 계산 및 상태 업데이트
    calculateAndUpdateMetrics: async () => {
        const { userData, updateUser } = get();

        if (userData && userData.height > 0 && userData.weight > 0) {
            try {
                // FatCalculator 호출 및 결과 분해
                const { bmi, fatPercentage } = FatCalculator(
                    userData.weight,
                    userData.height,
                    userData.gender,
                    userData.age
                );

                if (bmi === null || fatPercentage === null) {
                    console.warn("FatCalculator가 유효하지 않은 값을 반환했습니다.");
                    return;
                }

                // Firestore 업데이트
                await updateUser(userData.id, {
                    bmi,
                    fat: fatPercentage,
                });

                console.log("Firestore에 BMI 및 체지방률 업데이트 완료:", {
                    bmi,
                    fat: fatPercentage,
                });
            } catch (error) {
                console.error("BMI/체지방률 계산 및 Firestore 업데이트 중 오류 발생:", error);
            }
        } else {
            console.warn("사용자 데이터가 충분하지 않거나 잘못되었습니다.");
        }
    },
}));
