// src/app/layout.tsx
'use client';
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            <title>Body Check</title>
            <meta name="description" content="Body Check Application" />
        </head>
        <body>
        <SessionProvider>
            {children}
        </SessionProvider>
        <Script
            src="https://widget.cloudinary.com/v2.0/global/all.js"
            strategy="afterInteractive"
        />
        <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
            integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
            crossOrigin="anonymous"
        ></Script>
        </body>
        </html>
    );
}
