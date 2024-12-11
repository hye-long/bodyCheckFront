// 전역스타일 적용하기
// 페이지들에도 전역 스타일이 적용이 되었음 하니까


import { SessionProvider } from "next-auth/react";
import '../app/globals.css'; // 전역 스타일
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp;
