// src/firestore/firestore.ts
import { firestore } from './firebase';
import {collection, addDoc, getDoc, doc, query, where, getDocs, setDoc, updateDoc} from 'firebase/firestore';


/**
 * Firestore에서 유저 데이터를 조회
 * @param userId 유저의 고유 ID
 */
export const getUserData = async (userId: string) => {
    try {
        const userDocRef = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.warn(`User with ID ${userId} does not exist.`);
            return null;
        }
    } catch (error) {
        // @ts-ignore
        console.error(`Failed to fetch user data for ID ${userId}:`, error.message);
        throw error;
    }
};


/**
 * Firestore에서 아이디 중복 여부를 확인
 * @param id 확인할 아이디
 * @returns 아이디가 존재하면 true, 존재하지 않으면 false
 */
export const checkIdExists = async (id: string): Promise<boolean> => {
    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", id)); // id 필드로 중복 검사
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // 결과가 비어있지 않으면 중복된 아이디가 존재
    } catch (error) {
        console.error("Error checking ID existence:", error);
        throw error;
    }
};


/**
 * Firestore에서 이메일 중복을 확인하는 함수
 * @param email 체크할 이메일 주소
 * @returns 중복된 이메일이 있으면 true, 없으면 false 반환
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const usersRef = collection(firestore, 'users'); // 'users' 컬렉션 참조
        const q = query(usersRef, where('email', '==', email)); // 이메일이 일치하는 문서 조회
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // 문서가 있으면 true, 없으면 false
    } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        throw error;
    }
};

/**
 * Firestore에 새로운 유저 데이터를 추가
 * @param userId 유저의 고유 ID
 * @param data Firestore에 저장할 유저 데이터
 */
export const addUserData = async (userId: string, data: Record<string, any>) => {
    if (!userId) {
        throw new Error("User ID가 제공되지 않았습니다.");
    }
    if (!data) {
        throw new Error("저장할 데이터가 제공되지 않았습니다.");
    }

    try {
        const userDocRef = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            await updateDoc(userDocRef, data);
            console.log("기존 유저 데이터 업데이트 완료:", userId);
        } else {
            await setDoc(userDocRef, data);
            console.log("새 유저 데이터 추가 완료:", userId);
        }
    } catch (error) {
        // @ts-ignore
        console.error(`Firestore에 데이터 저장 중 오류 발생 (UserID: ${userId}):`, error.message);
        throw error;
    }
};


export const kakaoLoginAddUserData = async (userId: string, nickname: string) => {
    try {
        const userDocRef = doc(firestore, "users", userId); // Firestore 문서 참조
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            // 문서가 이미 존재하는 경우 업데이트
            await updateDoc(userDocRef, {
                name: nickname || "익명 사용자", // 닉네임 필드 업데이트
            });
            console.log("기존 유저 데이터 업데이트 완료:", userId);
        } else {
            // 문서가 없는 경우 새 데이터 추가
            await setDoc(userDocRef, {
                id: userId, // 카카오 ID
                name: nickname || "익명 사용자", // 닉네임
                address: "", // 기본값
                age: null, // 기본값
                gender: "", // 기본값
                height: null, // 기본값
                weight: null, // 기본값
                phoneNumber: "", // 기본값
                password: "", // 기본값
                confirmPassword: "", // 기본값
                bmi: null, // 기본값
                types: "개인회원", // 기본값
                createdAt: new Date(), // 생성 시간
            });
            console.log("새 카카오 유저 데이터 추가 완료:", userId);
        }
    } catch (error) {
        console.error("Firestore 저장 중 오류 발생 (카카오 로그인):", error);
        throw error;
    }
};
/**
 * Firestore에 이미지 URL 저장
 * @param userId 유저의 고유 ID
 * @param imageUrl 저장할 이미지 URL
 */
export const saveImageUrl = async (userId: string, imageUrl: string) => {
    try {
        const imagesRef = collection(firestore, "images");
        await addDoc(imagesRef, {
            userId,
            imageUrl,
            uploadedAt: new Date().toISOString(), // 업로드 시간 기록
        });
        console.log("이미지 URL 저장.");
    } catch (error) {
        console.error("이미지 URL 저장하다가 실패..:", error);
        throw error;
    }
};

/**
 * Firestore에서 특정 유저의 이미지 URL 조회
 * @param userId 유저의 고유 ID
 * @returns 이미지 URL 목록
 */
export const getUserImages = async (userId: string): Promise<string[]> => {
    try {
        const imagesRef = collection(firestore, "images");
        const q = query(imagesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const imageUrls: string[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.imageUrl) {
                imageUrls.push(data.imageUrl);
            }
        });

        return imageUrls;
    } catch (error) {
        console.error("에러:", error);
        throw error;
    }
};

/**
 * Firestore에서 유저 비밀번호를 조회
 * @param id 유저 ID
 * @param name 유저 이름
 * @returns 비밀번호를 반환하거나 null
 */
export const getPasswordByIdAndName = async (id: string, name: string): Promise<string | null> => {
    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", id), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("해당 ID와 이름을 가진 사용자가 없습니다.");
            return null;
        }

        const userData = querySnapshot.docs[0].data();
        return userData.password || null;
    } catch (error) {
        console.error("비밀번호 조회 오류:", error);
        throw error;
    }
};


interface UserData {
    id: string;
    age: number;
    height: number;
    weight: number;
    address: string;
    [key: string]: string | number;
}
/**
 * Firestore에서 사용자 데이터를 업데이트
 * @param userId 사용자 ID
 * @param updatedFields 업데이트할 필드 객체
 */
export const updateUserData = async (
    userId: string,
    updatedFields: Partial<UserData>
): Promise<void> => {
    try {
        const userDoc = doc(firestore, "users", userId);
        await updateDoc(userDoc, updatedFields);
        console.log("Firestore 데이터 업데이트 완료!");
    } catch (error) {
        console.error("Firestore 데이터 업데이트 오류:", error);
        throw error;
    }
};

export { firestore };
