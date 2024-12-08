'use client';

import React, { useState, useEffect, ChangeEvent } from "react";
import { useUserStore } from "@/store/userStore";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from '@/app/componenets/dashboardLayout';

interface UserData {
    id: string;
    age?: number;
    height?: number;
    weight?: number;
    password?: string;
    confirmPassword?: string;
    address?: string;
    bmi?: number;
    [key: string]: string | number | undefined;
}

const MyPage: React.FC = () => {
    const { userId } = useAuthStore(); // Zustand에서 userId 가져오기
    const { userData, isLoading, fetchUser, updateUser } = useUserStore(); // 사용자 정보 관련 Zustand 스토어
    const [formData, setFormData] = useState<UserData>({
        id: "",
        age: undefined,
        height: undefined,
        weight: undefined,
        address: "",
        password: "",
        confirmPassword: "",
    });
    const [isVerified, setIsVerified] = useState(false); // 비밀번호 확인 여부
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호 입력 값
    const [passwordError, setPasswordError] = useState<string | undefined>("소문자와 숫자를 포함한 8자리 이상이어야 합니다.");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>("비밀번호를 한 번 더 입력해주세요.");

    // BMI 계산
    const calculateBMI = (height: number | undefined, weight: number | undefined): number | null => {
        if (height && weight) {
            const heightInMeters = height / 100;
            return parseFloat((weight / (heightInMeters ** 2)).toFixed(2));
        }
        return null;
    };

    // userId가 변경되면 사용자 데이터 가져오기
    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId, fetchUser]);

    // userData가 변경되면 formData 초기화
    useEffect(() => {
        if (userData) {
            setFormData({
                id: userData.id || "",
                age: userData.age || undefined,
                height: userData.height || undefined,
                weight: userData.weight || undefined,
                address: userData.address || "",
                password: "",
                confirmPassword: "",
                bmi: userData.bmi || undefined,
            });
        }
    }, [userData]);

    // 입력 필드 값 변경 핸들러
    const handleChange = (field: keyof UserData, value: string | number) => {
        setFormData((prev) => {
            const updatedData = { ...prev, [field]: value };

            // 키 또는 몸무게가 변경되면 BMI 계산
            if (field === "height" || field === "weight") {
                updatedData.bmi = calculateBMI(updatedData.height, updatedData.weight) as number;
            }

            return updatedData;
        });

        if (field === "password") {
            if (typeof value === "string" && value.length >= 8 && /\d/.test(value) && /[a-z]/.test(value)) {
                setPasswordError(undefined); // 조건 충족 시 경고 메시지 제거
            } else {
                setPasswordError("소문자와 숫자를 포함한 8자리 이상이어야 합니다.");
            }
        }

        if (field === "confirmPassword") {
            if (typeof value === "string" && value === formData.password) {
                setConfirmPasswordError(undefined); // 비밀번호와 일치 시 경고 메시지 제거
            } else {
                setConfirmPasswordError("비밀번호를 한 번 더 입력해주세요.");
            }
        }
    };

    // 비밀번호 확인 버튼 핸들러
    const handlePasswordVerify = () => {
        if (currentPassword === userData?.password) {
            setIsVerified(true); // 비밀번호가 맞으면 필드 표시
        } else {
            alert("현재 비밀번호가 올바르지 않습니다."); // 비밀번호가 틀리면 경고 메시지
        }
    };

    // 저장 버튼 클릭 핸들러
    const handleSave = async () => {
        try {
            // 비밀번호 필드를 처리하지 않는 경우
            if (!formData.password && !formData.confirmPassword) {
                delete formData.password;
                delete formData.confirmPassword;
            }

            // 비밀번호와 비밀번호 확인이 입력된 경우에만 처리
            if (formData.password || formData.confirmPassword) {
                if (formData.password !== formData.confirmPassword) {
                    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                    return;
                }
            }

            // 수정된 필드만 업데이트
            const updatedData: Partial<UserData> = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== userData?.[key as keyof UserData] && key !== "confirmPassword") {
                    if (key === "password" && formData[key] === "") {
                        return; // 비밀번호가 비어 있으면 업데이트하지 않음
                    }
                    updatedData[key as keyof UserData] = formData[key];
                }
            });

            if (Object.keys(updatedData).length === 0) {
                alert("변경된 내용이 없습니다.");
                return;
            }

            if (typeof userId === "string") {
                await updateUser(userId, updatedData); // 수정된 데이터만 업데이트
                alert("성공적으로 업데이트되었습니다.");
            }
        } catch (error) {
            console.error("수정 오류:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    // 필드 렌더링 함수
    const renderField = (
        label: string,
        field: keyof UserData,
        type: "text" | "number" | "password",
        description?: string,
        isDisabled?: boolean // 비활성화 여부 추가
    ) => (
        <div className="flex items-center py-3  ">
            <div className="w-1/3 text-gray-700 font-medium">{label}</div>
            <div className="w-2/3">
                {isDisabled ? (
                    <p className="text-gray-500">{formData[field] || "N/A"}</p> // 비활성화 필드는 텍스트로 표시
                ) : (
                    <input
                        type={type}
                        value={formData[field] || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                                field,
                                type === "number"
                                    ? parseInt(e.target.value, 10)
                                    : e.target.value
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-400 text-black rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                )}
                {description && <p className="text-sm text-red-500 mt-1">{description}</p>}
            </div>
        </div>
    );

    if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;

    return (
        <DashboardLayout>
            <div className="mt-10 max-w-3xl mx-auto p-8  ">
                {!isVerified ? (
                    <>
                        <h1 className="text-3xl font-bold text-black mb-10">비밀번호 확인</h1>
                        <hr className="max-w-3xl mb-10 text-black" />
                        <p className="text-2xl text-gray-500 mb-6">
                            나의 정보를 확인하려면 현재 비밀번호를 입력하세요.
                        </p>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호 입력"
                            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 mb-6"
                        />
                        <button
                            onClick={handlePasswordVerify}
                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition"
                        >
                            확인
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-black mb-4">나의 정보</h1>
                        <p className="text-2xl text-gray-500 mb-6">
                            고객님 정보를 확인하고 수정하세요. <br />
                            정확한 정보 입력이 안전한 서비스 이용을 도와줍니다.
                        </p>
                        <div className="text-2xl border-t border-gray-300 mt-7 mb-6"></div>

                        {renderField("아이디", "id", "text", undefined, true)} {/* 아이디는 비활성화 */}
                        {renderField("나이", "age", "number")}
                        {renderField("키", "height", "number")}
                        {renderField("몸무게", "weight", "number")}
                        {renderField("주소", "address", "text")}
                        {renderField(
                            "비밀번호",
                            "password",
                            "password",
                            passwordError,
                        )}
                        {renderField(
                            "비밀번호 확인",
                            "confirmPassword",
                            "password",
                            confirmPasswordError,
                        )}



                        <button
                            onClick={handleSave}
                            className="text-2xl w-full bg-black text-white py-3 px-6 mt-8 rounded-lg font-medium hover:bg-gray-700 transition"
                        >
                            수정 완료
                        </button>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyPage;
