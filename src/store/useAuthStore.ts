import { create } from "zustand";
import { auth } from "@/app/firestore/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {getUserData} from "@/app/firestore/firestore";

// Auth 상태 인터페이스 정의
interface AuthState {
    isAuthenticated: boolean; // 사용자 인증 상태
    isLoading: boolean; // 로딩 상태
    userId: string | null; // 로그인된 사용자 ID
    user: any; // 사용자 데이터 (Firestore에서 가져온 데이터)
    login: (userId: string) => void; // 로그인 함수
    logout: () => void; // 로그아웃 함수
    fetchUserData: (userId: string) => Promise<void>; // Firestore 사용자 데이터 가져오기
}

// Zustand Store 생성
const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    user: null,

    login: (userId: string) => {
        set({ isAuthenticated: true, isLoading: false, userId });
    },

    logout: () => {
        set({ isAuthenticated: false, isLoading: false, userId: null, user: null });
    },

    fetchUserData: async (userId: string) => {
        set({ isLoading: true });
        try {
            const userData = await getUserData(userId); // Firestore에서 사용자 데이터 가져오기
            set({ user: userData, isLoading: false });
        } catch (error) {
            console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
