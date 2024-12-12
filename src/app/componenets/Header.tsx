"use client";

import React from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";

interface HeaderProps {
    toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex justify-between items-center bg-[#030303] shadow-md py-4 px-4 sm:px-1 md:py-4 md:px-8 sticky top-0 z-50 text-white">
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

            {/* 로고 */}
            <Link href={isAuthenticated ? "/dashboard" : "/"} passHref>
                <p className="text-[24px] font-sans hover:opacity-80 cursor-pointer whitespace-nowrap">
                    BODY:CHECK
                </p>
            </Link>

            {/* 네비게이션 */}
            <nav className="flex gap-4">
                {isAuthenticated ? (
                    <>
                        <Link href="/myPage" passHref>
                            <p className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300">
                                마이페이지
                            </p>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300"
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link href="/Login" passHref>
                        <p className="bg-transparent border-none text-white text-base cursor-pointer hover:text-gray-300">
                            로그인 / 회원가입
                        </p>
                    </Link>
                )}
            </nav>
        </header>
    );
}
