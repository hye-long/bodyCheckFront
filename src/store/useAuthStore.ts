import { create } from "zustand";
import { validateUser } from "@/app/firestore/auth";

interface AuthState {
    isAuthenticated: boolean; // 사용자 인증 상태
    isLoading: boolean; // 로딩 상태
    userId: string | null; // 현재 로그인된 사용자 ID
    login: (userId: string, password: string) => Promise<boolean>; // 로그인 함수
    logout: () => void; // 로그아웃 함수
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: false,
    userId: null,

    // 로그인 처리
    login: async (userId: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
            const user = await validateUser(userId, password);
            if (user) {
                set({ isAuthenticated: true, isLoading: false, userId });
                return true;
            }
            set({ isAuthenticated: false, isLoading: false, userId: null });
            return false;
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            set({ isLoading: false });
            return false;
        }
    },

    // 로그아웃 처리
    logout: () => {
        set({ isAuthenticated: false, userId: null });
    },
}));

export default useAuthStore;
