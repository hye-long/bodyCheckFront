"use client";

import React from "react";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/useAuthStore";

interface HeaderProps {
    toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            // 로컬 스토리지나 쿠키 등 클라이언트 리소스 초기화
            localStorage.removeItem("user_session"); // 필요 시 로컬 스토리지에서 세션 제거

            // Zustand 상태 초기화
            logout();

            // 로그인 페이지로 리다이렉션
            router.push("/Login");
        } catch (err) {
            console.error("로그아웃 중 오류 발생:", err);
        }
    };

    // 로고클릭을 했을 때 처리함수
    const handleLogoClick = () => {
        if (isAuthenticated) {
            router.push("/dashboard"); // 로그인된 상태에서 /dashboard로 이동
        } else {
            router.push("/"); // 비로그인 상태에서 홈으로 이동
        }
    };

    return (
        <header className="flex justify-between items-center bg-[#030303] shadow-md py-4 px-8 sticky top-0 z-50 text-white">
            {/* 햄버거 메뉴 (로그인 상태일 때만 표시) */}
            {isAuthenticated && toggleSidebar && (
                <button
                    onClick={toggleSidebar}
                    className="bg-transparent border-b-4 border-white/20 text-white cursor-pointer"
                    aria-label="메뉴 열기"
                >
                    <FaBars size={24} />
                </button>
            )}

            {/* 로고 (클릭 시 페이지 이동) */}
            <p
                className="text-[24px] font-sans hover:opacity-80 cursor-pointer"
                onClick={handleLogoClick}
            >
                BODY:CHECK
            </p>

            {/* 네비게이션 */}
            <nav className="flex gap-4">
                {isAuthenticated ? (
                    <>
                        <button
                            onClick={() => router.push("/myPage")}
                            className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300"
                        >
                            마이페이지
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300"
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => router.push("/Login")}
                            className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300"
                        >
                            로그인
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}
