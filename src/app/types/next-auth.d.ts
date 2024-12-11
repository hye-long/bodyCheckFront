import NextAuth from "next-auth";

declare module "next-auth" {
    interface Profile {
        id?: string; // 카카오에서 받은 사용자 ID
        name?: string;
        email?: string;
        image?: string;
    }

    interface Session {
        user: {
            id: string; // 카카오 사용자 ID
            name?: string;
            email?: string;
            image?: string;
        };
    }
}
