import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.redirect("/dashboard?error=missing_code");
        }

        // 카카오 API로 Access Token 요청
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
            return NextResponse.redirect("/dashboard?error=token_request_failed");
        }

        const { access_token } = await tokenResponse.json();

        // 사용자 정보 요청
        const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userResponse.ok) {
            return NextResponse.redirect("/dashboard?error=user_info_failed");
        }

        const userData = await userResponse.json();
        const userId = userData.id.toString();
        const nickname = userData.kakao_account.profile.nickname || "회원";

        // Firestore에 사용자 저장
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                id: userId,
                name: nickname,
                createdAt: new Date().toISOString(),
            });
        }

        // 대시보드로 리다이렉트
        return NextResponse.redirect("/dashboard");
    } catch (error) {
        console.error("Error in Kakao Login API:", error);
        return NextResponse.redirect("/dashboard?error=server_error");
    }
}
