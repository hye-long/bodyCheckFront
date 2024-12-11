import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { kakaoLoginAddUserData } from "@/app/firestore/firestore";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_code`);
    }

    try {
        // Access Token 요청
        const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
                client_secret: process.env.KAKAO_CLIENT_SECRET!,
                redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
                code,
            }),
        });

        if (!tokenResponse.ok) {
            console.error("Access Token 요청 실패:", await tokenResponse.text());
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=token_request_failed`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 사용자 정보 요청
        const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            console.error("사용자 정보 요청 실패:", await userResponse.text());
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=user_info_failed`);
        }

        const userData = await userResponse.json();
        console.log("카카오 사용자 데이터:", userData);

        const userId = userData.id?.toString();
        const nickname = userData.kakao_account?.profile?.nickname;

        if (!userId || !nickname) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_user_data`);
        }

        // Firestore에 사용자 데이터 저장
        try {
            await kakaoLoginAddUserData(userId, nickname);
        } catch (error) {
            console.error("Firestore 저장 중 오류 발생:", error);
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=firestore_save_failed`);
        }

        // 성공 시 대시보드로 리디렉션
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
    } catch (error) {
        console.error("카카오 리디렉션 처리 중 오류:", error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=callback_error`);
    }
}
