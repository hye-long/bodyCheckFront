"use client";

import React, { useState } from "react";
import Sidebar from "@/app/componenets/sidebar";
import Header from "./Header";
import ProtectedRoute from "@/app/protectedRoute";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <ProtectedRoute isRestricted={true}>
            <div className="flex h-screen bg-gray-100">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex flex-col flex-1">
                    <Header toggleSidebar={toggleSidebar} />
                    <main className="flex-1 p-4">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
