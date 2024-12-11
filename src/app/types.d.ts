// 타입을 정해보장
import NextAuth from "next-auth";


interface Cloudinary {
    createUploadWidget: (
        options: any,
        callback: (error: any, result: any) => void
    ) => { open: () => void };
}

interface Window {
    cloudinary: Cloudinary;
}

declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string;
    }
}

interface KakaoProfile {
    id: string; // 카카오 사용자 ID
    connected_at: string; // 연결된 시간
    properties: {
        nickname: string; // 닉네임
    };
    kakao_account: {
        profile: {
            nickname: string;
            is_default_nickname: boolean;
        };
        profile_nickname_needs_agreement: boolean;
    };
}


declare module "next-auth" {
    interface Profile {
        id: string; // 카카오 사용자 고유 ID
        nickname: string; // 카카오 프로필 닉네임
    }
}
