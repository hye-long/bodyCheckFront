import { GetServerSideProps } from "next";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.cookies.user_session || null;

    if (!userId) {
        return {
            redirect: {
                destination: "/Login",
                permanent: false,
            },
        };
    }

    try {
        // Firestore에서 사용자 이름 가져오기
        const userDoc = await getDoc(doc(firestore, "users", userId));
        const userName = userDoc.exists() ? (userDoc.data().name as string) : null;

        // Firestore에서 운동 세션 가져오기
        const sessionQuery = query(
            collection(firestore, "workout_sessions"),
            where("user_id", "==", userId)
        );
        const sessionSnapshot = await getDocs(sessionQuery);
        const workoutSessions = sessionSnapshot.docs.map((doc) => ({
            workout_type: doc.data().workout_type as string,
            sets: doc.data().sets.map((set: any) => ({
                reps: set.reps as number,
                weight: set.weight as string,
            })),
            date: doc.data().date as string,
        }));

        return {
            props: {
                userName,
                workoutSessions,
            },
        };
    } catch (error) {
        console.error("SSR 오류 발생:", error);
        return {
            props: {
                userName: null,
                workoutSessions: [],
            },
        };
    }
};
