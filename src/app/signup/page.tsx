'use client';
import React from "react";
import useSignupStore from "@/store/useSignupStore";
import {useRouter} from "next/navigation";
import {handleSignup, checkIdAvailability, isPasswordValid} from "../utils/signupUtils";

export default function Signup() {
    const router = useRouter();
    const {
        id,
        password,
        confirmPassword,
        name,
        gender,
        address,
        height,
        weight,
        age,
        isIdUnique,
        passwordError,
        confirmPasswordError,
        setField,
    } = useSignupStore();

    // 아이디 중복 확인 핸들러
    const handleIdCheck = async () => {
        if (!id) {
            alert("아이디를 입력해주세요.");
            return;
        }

        const isAvailable = await checkIdAvailability(id);
        if (isAvailable) {
            setField("isIdUnique", true);
            alert("사용 가능한 아이디입니다.");
        } else {
            setField("isIdUnique", false);
            alert("이미 사용 중인 아이디입니다.");
        }
    };

    // 비밀번호 변경 시 유효성 검사
    const handlePasswordChange = (value: string) => {
        setField("password", value);

        if (!isPasswordValid(value)) {
            setField("passwordError", "비밀번호는 소문자와 숫자를 포함한 8자리 이상이어야 합니다.");
        } else {
            setField("passwordError", null);
        }

        // confirmPassword와의 일치 여부 다시 확인
        if (confirmPassword && confirmPassword !== value) {
            setField("confirmPasswordError", "비밀번호가 일치하지 않습니다.");
        } else {
            setField("confirmPasswordError", null);
        }
    };

    // confirmPassword 변경 시 유효성 검사
    const handleConfirmPasswordChange = (value: string) => {
        setField("confirmPassword", value);

        if (value !== password) {
            setField("confirmPasswordError", "비밀번호가 일치하지 않습니다.");
        } else {
            setField("confirmPasswordError", null);
        }
    };

    // 폼 유효성 검사
    const isFormValid = (): "" | false | null | boolean => {
        return (
            id &&
            password &&
            confirmPassword &&
            name &&
            gender &&
            isIdUnique &&
            !passwordError &&
            !confirmPasswordError
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white p-6 md:p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">BODY : CHECK</h1>
                <h2 className="text-lg md:text-xl text-center mb-6">회원가입</h2>
                <form
                    onSubmit={(e) => handleSignup(e, router)}
                    className="flex flex-col gap-4"
                >
                    {/* 아이디 입력 */}
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                            아이디
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                id="id"
                                type="text"
                                value={id}
                                onChange={(e) => setField("id", e.target.value)}
                                placeholder="아이디를 입력하세요"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleIdCheck}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                중복 확인
                            </button>
                        </div>
                        {isIdUnique === false && (
                            <p className="text-red-500 text-sm mt-2">이미 사용 중인 아이디입니다.</p>
                        )}
                        {isIdUnique === true && (
                            <p className="text-green-500 text-sm mt-2">사용 가능한 아이디입니다.</p>
                        )}
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                            placeholder="비밀번호를 다시 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                        />
                        {confirmPasswordError && (
                            <p className="text-red-500 text-sm mt-2">{confirmPasswordError}</p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            이름
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="이름을 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                        />
                    </div>

                    {/* 성별 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">성별</label>
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => setField("gender", "남")}
                                className={`px-4 py-2 border rounded-lg ${
                                    gender === "남"
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                            >
                                남
                            </button>
                            <button
                                type="button"
                                onClick={() => setField("gender", "여")}
                                className={`px-4 py-2 border rounded-lg ${
                                    gender === "여"
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                            >
                                여
                            </button>
                        </div>
                    </div>

                    {/* 회원가입 버튼 */}
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white rounded-lg mt-6 ${
                            isFormValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
                        }`}
                        disabled={!isFormValid()}
                    >
                        회원가입 완료
                    </button>
                </form>
            </div>
        </div>
    )
}
