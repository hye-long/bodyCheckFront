import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session")?.value;

    if (!session && req.url.includes("/dashboard")) {
        return NextResponse.redirect(new URL("/Login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // 인증이 필요한 경로
};
