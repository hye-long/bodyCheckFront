'use server';

import { cookies } from "next/headers";

const COOKIE_NAME = "user_session";

export async function createSession(userId: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1일
    });
}

export async function getSession(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
        maxAge: -1,
        path: "/",
    });
}
