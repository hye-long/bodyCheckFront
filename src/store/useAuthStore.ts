import { create } from "zustand";

// Zustand 상태 인터페이스 정의
interface AuthState {
    isAuthenticated: boolean; // 사용자가 인증되었는지 여부
    userId: string | null; // 사용자 ID
    login: (userId: string) => void; // 로그인 함수
    logout: () => void; // 로그아웃 함수
    setUserId: (userId: string | null) => void; // Firebase 인증 상태 동기화 함수
}

// Zustand 상태 관리 스토어 생성
const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false, // 초기 인증 상태는 false
    userId: null, // 초기 사용자 ID는 null
    // 로그인 시 상태 업데이트
    login: (userId: string) => set({ isAuthenticated: true, userId }),
    // 로그아웃 시 상태 초기화
    logout: () => set({ isAuthenticated: false, userId: null }),
    // Firebase 인증 상태 변경 시 Zustand 상태 동기화
    setUserId: (userId: string | null) =>
        set({ isAuthenticated: !!userId, userId }),
}));

export default useAuthStore;
