"use client";

import React, { useState } from "react";
import Sidebar from "@/app/componenets/sidebar";
import Header from "./Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// import ProtectedRoute from "@/app/protectedRoute";
// 일단 ProtectedRoute 뺌
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();


    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (status === "loading") {
        return <div>Loading...</div>; // 로딩 상태 처리
    }

    if (!session) {
        router.push("/Login");
        return null;
    }


    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex flex-col flex-1">
                    <Header toggleSidebar={toggleSidebar} />
                    <main className="flex-1 p-4">{children}</main>
                </div>
            </div>
    );
}
