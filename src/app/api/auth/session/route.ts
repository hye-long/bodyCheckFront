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
                { error: "Unauthorized - No userId found" },
                { status: 401 }
            );
        }

        // Firebase에서 사용자의 데이터를 가져오기
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (!userDoc.exists()) {
            return NextResponse.json(
                { error: "User data not found in Firestore" },
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
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
