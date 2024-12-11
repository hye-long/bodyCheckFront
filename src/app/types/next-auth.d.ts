import NextAuth from "next-auth";

declare module "next-auth" {
    interface Profile {
        id?: string; // 카카오에서 받은 사용자 ID
        name?: string;
        email?: string;
        image?: string;
    }

    declare module "next-auth" {
        interface Session {
            user: {
                name: number;
                sub: string;
                type: string;
                token: string;
                id: string;
                iat: number;
                exp: number;
                jti: string;
            };
            accessToken: string;
            refreshToken: string;
        }
    }
}
