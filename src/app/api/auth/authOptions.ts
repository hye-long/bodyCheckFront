import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
    providers: [
        KakaoProvider({
            clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }: any) {
            if (account && profile) {
                token.id = profile.id?.toString();
                token.name = profile.kakao_account?.profile?.nickname;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                };
            }
            return session;
        },
    },
};
