// Firestore 데이터 관련 유틸리티
import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

/**
 * Firestore에서 유저 데이터를 가져오기
 * @param userId Firestore의 'users' 컬렉션의 사용자 ID
 * @returns 사용자 데이터 또는 null
 */
export const getUserData = async (userId: string): Promise<any | null> => {
    try {
        const userDoc = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        return userSnapshot.exists() ? userSnapshot.data() : null;
    } catch (error) {
        console.error("Firestore에서 사용자 데이터를 가져오는 중 오류:", error);
        return null;
    }
};


export const getUserNameById = async (userId: string): Promise<string | null> => {
    try {
        const user = await getUserData(userId);
        return user?.name || null; // name 필드 반환
    } catch (error) {
        console.error("사용자 이름 가져오기 중 오류:", error);
        return null;
    }
};

/**
 * Firestore에서 사용자 데이터 업데이트
 * @param userId 사용자 ID
 * @param updatedFields 업데이트할 필드
 */
export const updateUserData = async (userId: string, updatedFields: Partial<any>): Promise<void> => {
    try {
        const userDoc = doc(firestore, "users", userId);
        await updateDoc(userDoc, updatedFields);
    } catch (error) {
        console.error("Firestore 데이터 업데이트 중 오류:", error);
        throw error;
    }
};


// 운동 세트 인터페이스
interface WorkoutSet {
    reps: number;
    weight: string;
}
// 운동 세션 인터페이스
interface WorkoutSession {
    workout_type: string;
    sets: WorkoutSet[];
    date: string;
    color?: string;
}

export const getWorkoutSessionsByUser = async (userId: string): Promise<WorkoutSession[]> => {
    try {
        const q = query(
            collection(firestore, "workout_sessions"),
            where("user_id", "==", userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.data() as WorkoutSession); // 데이터를 배열로 반환
    } catch (error) {
        console.error("운동 세션 가져오기 중 오류:", error);
        return [];
    }
};

