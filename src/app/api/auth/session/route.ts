import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";
import useAuthStore from "@/store/useAuthStore";

export async function GET() {
    try {
        // Zustand에서 userId 가져오기
        const { userId } = useAuthStore.getState();

        if (!userId) {
            return NextResponse.json(
                { error: "userId가 없어요" },
                { status: 401 }
            );
        }

        // Firebase에서 사용자의 데이터를 가져오기
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (!userDoc.exists()) {
            return NextResponse.json(
                { error: "firestore 에 데이터 없음" },
                { status: 404 }
            );
        }

        // 사용자 데이터를 반환
        const userData = userDoc.data();
        return NextResponse.json({
            user: {
                id: userId,
                ...userData,
            },
        });
    } catch (error) {
        console.error("Session API 오류:", error);
        // @ts-ignore
        // @ts-ignore
        return NextResponse.json(
            { error: "server에러..", details: error.message },
            { status: 500 }
        );
    }
}
