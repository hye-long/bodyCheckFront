'use client';

import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import LogoText from '@/app/componenets/logoText';
import useSyncAuthState from "../../store/useSyncAuthState";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

const Login: FC = () => {
    useSyncAuthState();
    const { login } = useAuthStore(); // Zustand 상태관리
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // 카카오 로그인 로직
    const handleKakaoLogin = async () => {
        try {
            // 카카오 로그인 인증 URL로 이동
            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;
            window.location.href = kakaoAuthUrl;
        } catch (error) {
            console.error("카카오 로그인 오류:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    };

    // Firebase 로그인 로직 (기존 유지)
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('id', '==', id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();

                if (user && user.password === password) {
                    login(id); // Zustand 상태 업데이트
                    setTimeout(() => {
                        router.push("/dashboard"); // 대시보드로 이동
                    }, 200);
                } else {
                    setError("아이디 또는 비밀번호가 잘못되었습니다.");
                }
            } else {
                setError("아이디 또는 비밀번호가 잘못되었습니다.");
            }
        } catch (err) {
            console.error("로그인 중 오류:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
            setError("로그인 중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center text-white">
            <LogoText text="BODY : CHECK" />
            <h2 className="text-2xl font-medium text-center text-black mt-4">로그인</h2>
            <hr className="w-full border-t border-gray-400 my-6 max-w-lg" />

            {/* Firebase 로그인 */}
            <form className="w-full max-w-lg flex flex-col gap-4" onSubmit={handleLogin}>
                <div className="flex flex-col">
                    <label className="mb-2 text-black">아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setError(null);
                        }}
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null);
                        }}
                        required
                        autoComplete="current-password"
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                <hr className="w-full border-t border-gray-400 my-6" />

                <button
                    type="submit"
                    className={`w-full py-3 text-white rounded-md ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>

                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            </form>

            <hr className="w-full border-t border-black my-6 max-w-lg" />

            {/* 카카오 로그인 */}
            <button
                type="button"
                onClick={handleKakaoLogin}
                className="w-full py-3 mt-4 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
            >
                카카오 로그인
            </button>

            <div className="w-full max-w-lg flex justify-between items-center mt-4">
                <Link href="/signup">
                    <p className="text-sm text-black hover:underline">회원가입</p>
                </Link>
            </div>
        </div>
    );
};

export default Login;
