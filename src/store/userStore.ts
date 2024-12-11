// @ts-ignore

import { create } from "zustand";
import { getUserData, updateUserData } from "@/app/firestore/firestore";
import { FatCalculator } from "../app/componenets/FatCalculator";

export interface UserData {
    id: string;
    name: string;
    password: string;
    gender: string;
    age: number | null; // null 허용
    types: string;
    height: number;
    weight: number;
    address: string;
    bmi: number | null; // null 허용
    fat: number | null; // 체지방률 추가, null 허용
    [key: string]: string | number | null;
}

interface UserState {
    userData: UserData | null;
    isLoading: boolean;
    fetchUser: (userId: string) => Promise<void>;
    updateUser: (userId: string, updatedFields: Partial<UserData>) => Promise<void>;
    calculateAndUpdateMetrics: () => Promise<void>; // BMI 및 체지방률 계산
    calculateFatOnly: () => Promise<void>; // 체지방률만 계산
}

export const useUserStore = create<UserState>((set, get) => ({
    userData: null,
    isLoading: false,

    // Firestore에서 사용자 데이터 로드
    fetchUser: async (userId: string) => {
        set({ isLoading: true });
        try {
            const data = await getUserData(userId);
            // @ts-ignore
            set({ userData: data || null, isLoading: false });
        } catch (error) {
            console.error("사용자 데이터 로드 오류:", error);
            set({ isLoading: false });
        }
    },

    // Firestore에서 사용자 데이터 업데이트
    updateUser: async (userId: string, updatedFields: Partial<UserData>) => {
        try {
            // @ts-ignore
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

        if (userData && userData.height > 0 && userData.weight > 0 && userData.age !== null) {
            const metrics = FatCalculator(userData.weight, userData.height, userData.gender, userData.age);

            if (metrics) {
                const { bmi, fatPercentage } = metrics;

                try {
                    // Zustand 상태 업데이트 및 Firestore 동기화
                    await updateUser(userData.id, {
                        bmi,
                        fat: fatPercentage,
                    });
                    console.log("Firestore에 BMI 및 체지방률 업데이트 완료:", {
                        bmi,
                        fat: fatPercentage,
                    });
                } catch (error) {
                    console.error("BMI/체지방률 업데이트 중 오류 발생:", error);
                }
            } else {
                console.warn("FatCalculator에서 체지방률을 계산하지 못했습니다.");
            }
        } else {
            console.warn("사용자 데이터가 충분하지 않거나 잘못되었습니다.");
        }
    },

    // 체지방률만 계산 및 상태 업데이트
    calculateFatOnly: async () => {
        const { userData, updateUser } = get();

        if (userData && userData.bmi != null && userData.bmi > 0 && userData.age !== null) {
            const metrics = FatCalculator(userData.weight, userData.height, userData.gender, userData.age);

            if (metrics) {
                const { fatPercentage } = metrics;

                try {
                    await updateUser(userData.id, {
                        fat: fatPercentage,
                    });
                    console.log("Firestore에 체지방률 업데이트 완료:", {
                        fat: fatPercentage,
                    });
                } catch (error) {
                    console.error("체지방률 업데이트 중 오류 발생:", error);
                }
            } else {
                console.warn("FatCalculator에서 체지방률을 계산하지 못했습니다.");
            }
        } else {
            console.warn("BMI 데이터가 부족하거나 잘못되었습니다.");
        }
    },
}));
