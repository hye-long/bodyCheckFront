// Firestore 인증 관련 유틸리티
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

/**
 * Firestore에서 사용자 ID와 비밀번호 검증
 * @param id Firestore의 'users' 컬렉션의 사용자 ID
 * @param password Firestore의 사용자 비밀번호
 * @returns 사용자 데이터 또는 null
 */
export const validateUser = async (id: string, password: string): Promise<any | null> => {
    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            return user.password === password ? user : null;
        }
        return null; // 사용자가 없거나 비밀번호가 일치하지 않음
    } catch (error) {
        console.error("사용자 인증 중 오류:", error);
        return null;
    }
};
