"use client";

import React from "react";
import useSignupStore from "@/store/useSignupStore";
import { useRouter } from "next/navigation";
import {
    handleInputChange,
    handleIdCheck,
    handleSignup,
    isFormValid,
} from "../utils/signupUtils";
import LogoText from "@/app/componenets/logoText";
import BMICalculator from "@/app/componenets/BMICalculator";

export default function Signup() {
    const router = useRouter();
    const {
        id,
        password,
        confirmPassword,
        name,
        gender,
        height,
        age,
        weight,
        address,
        isIdUnique,
        isSignupComplete,
        passwordError,
        confirmPasswordError,
        types,
    } = useSignupStore();

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center text-black">
            <LogoText text="BODY : CHECK" />
            <h2 className="text-2xl font-medium text-center text-black mt-4">회원가입</h2>
            <hr className="w-full border-t border-gray-400 my-6 max-w-lg" />

            <form
                className="w-full max-w-lg flex flex-col gap-4"
                onSubmit={(e) => handleSignup(e, router)}
            >
                <div className="flex flex-col">
                    <label className="mb-2 text-black">*아이디</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => handleInputChange("id", e.target.value)}
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                        placeholder="아이디를 입력하세요"
                    />
                    <button
                        type="button"
                        onClick={handleIdCheck}
                        className={`mt-2 px-4 py-2 text-white rounded-md ${
                            isIdUnique
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-700 hover:bg-blue-600"
                        }`}
                        disabled={isIdUnique === true}
                    >
                        중복 확인
                    </button>
                    {isIdUnique === true && (
                        <p className="text-green-500 text-sm mt-2">아이디 확인 완료!</p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                        placeholder="비밀번호를 입력하세요"
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                        placeholder="비밀번호 확인"
                    />
                    {confirmPasswordError && (
                        <p className="text-red-500 text-sm mt-2">{confirmPasswordError}</p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                {/* 회원유형 */}
                <div className="flex flex-col">
                    <label className="mb-2 text-black">*회원유형</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleInputChange("types", "개인회원")}
                            className={`px-6 py-2 border rounded-md ${
                                types === "개인회원"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-black border-black"
                            }`}
                        >
                            개인회원
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange("types", "기업회원")}
                            className={`px-6 py-2 border rounded-md ${
                                types === "기업회원"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-black border-black"
                            }`}
                        >
                            기업회원
                        </button>
                    </div>
                </div>

                {/* 성별 */}
                <div className="flex flex-col">
                    <label className="mb-2 text-black">*성별</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "남")}
                            className={`px-6 py-2 border rounded-md ${
                                gender === "남"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-black border-black"
                            }`}
                        >
                            남
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange("gender", "여")}
                            className={`px-6 py-2 border rounded-md ${
                                gender === "여"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-black border-black"
                            }`}
                        >
                            여
                        </button>
                    </div>
                </div>

                {/* 나이, 키, 몸무게, 주소 */}
                <div className="flex flex-col">
                    <label className="mb-2 text-black">*나이</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) =>
                            handleInputChange("age", Number(e.target.value))
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*키</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) =>
                            handleInputChange("height", Number(e.target.value))
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*몸무게</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) =>
                            handleInputChange("weight", Number(e.target.value))
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-black">*주소</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) =>
                            handleInputChange("address", e.target.value)
                        }
                        required
                        className="px-4 py-2 border border-black bg-white rounded-md text-black focus:outline-none focus:ring focus:ring-gray-500"
                    />
                </div>

                {/* 회원가입 버튼 */}
                <button
                    type="submit"
                    className={`w-full py-3 mt-6 text-white rounded-md ${
                        isFormValid()
                            ? "bg-blue-700 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isFormValid()}
                >
                    회원가입 완료
                </button>
                <BMICalculator />
            </form>
        </div>
    );
}
