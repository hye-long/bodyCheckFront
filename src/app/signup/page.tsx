'use client';
import React from "react";
import useSignupStore from "@/store/useSignupStore";
import { useRouter } from "next/navigation";
import { handleSignup, checkIdAvailability, isPasswordValid } from "../utils/signupUtils";

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
            address &&
            height > 0 &&
            weight > 0 &&
            age > 0 &&
            isIdUnique &&
            !passwordError &&
            !confirmPasswordError
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">회원가입</h1>
            <form
                onSubmit={(e) => handleSignup(e, router)}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
            >
                {/* 아이디 입력 */}
                <div className="mb-4">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                        아이디
                    </label>
                    <div className="flex items-center gap-2">
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
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        비밀번호
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="mb-4">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    {confirmPasswordError && (
                        <p className="text-red-500 text-sm mt-2">{confirmPasswordError}</p>
                    )}
                </div>

                {/* 이름 */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        이름
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* 성별 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">성별</label>
                    <div className="flex gap-4">
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

                {/* 나이, 키, 몸무게, 주소 */}
                <div className="mb-4">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        나이
                    </label>
                    <input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setField("age", parseInt(e.target.value))}
                        placeholder="나이를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        키 (cm)
                    </label>
                    <input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setField("height", parseFloat(e.target.value))}
                        placeholder="키를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        몸무게 (kg)
                    </label>
                    <input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setField("weight", parseFloat(e.target.value))}
                        placeholder="몸무게를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        주소
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setField("address", e.target.value)}
                        placeholder="주소를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* 회원가입 버튼 */}
                <button
                    type="submit"
                    className={`w-full px-4 py-2 text-white rounded-lg ${
                        isFormValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
                    }`}
                    disabled={!isFormValid()}
                >
                    회원가입 완료
                </button>
            </form>
        </div>
    );
}
