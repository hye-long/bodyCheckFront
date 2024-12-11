import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";

// 개인키와 공개키 파일 경로
const privateKeyPath = path.join(process.cwd(), "keys", "private.pem");
const publicKeyPath = path.join(process.cwd(), "keys", "public.pem");

// 개인키와 공개키 읽기
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

// JWT 생성 함수
export function generateJWT(payload: object, expiresIn: string = "1h"): string {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn,
    });
}

// JWT 검증 함수
export function verifyJWT(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as JwtPayload;
    } catch (err) {
        // @ts-ignore
        console.error("JWT 검증 실패:", err.message);
        return null;
    }
}

// JWT 만료 여부 확인
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = verifyJWT(token);
        const exp = decoded?.exp;
        return exp ? Date.now() >= exp * 1000 : false;
    } catch (err) {
        // @ts-ignore
        console.error("JWT 만료 확인 중 오류:", err.message);
        return true;
    }
}
