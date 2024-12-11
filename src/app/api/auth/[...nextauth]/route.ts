// NextAuth.js 가 제공하는 인증 기능을 처리하고 통합된 인증 세션관리 구현하려고 함


import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
    providers: [
        KakaoProvider({
            clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET || "",
        })
    ]
});

export default handler;
