// 얘는 뭐냐면
// 이미지 업로드하고 서버에 보내는 거까지 포함하는 컴포넌트
"use client";

import React, { useState } from "react";
import {height} from "@fortawesome/free-solid-svg-icons/fa0";

interface ImageUploaderProps {
    onAnalysisComplete: (result: number[]) => void; // 분석 결과를 부모 컴포넌트로 전달
    onImageUploadToFirestore: (url: string) => void; // 업로드된 이미지 URL을 Firestore 저장을 위해 전달
    height: number; // 키 (cm)
    bmi: number;    // BMI 값
}

const ImageUploaderComponent: React.FC<ImageUploaderProps> = ({ onAnalysisComplete, onImageUploadToFirestore,height,bmi }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Cloudinary 스크립트 로드
    React.useEffect(() => {
        if (window.cloudinary) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error("Cloudinary script 로드 실패");
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Cloudinary 업로드 및 서버로 전송
    const handleUpload = () => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error("Cloudinary 업로드 오류:", error);
                    return;
                }

                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;
                    const fileBlob = await fetch(uploadedUrl).then((res) => res.blob());

                    onImageUploadToFirestore(uploadedUrl);

                    const formData = new FormData();
                    formData.append("image", fileBlob);
                    // @ts-ignore
                    formData.append("height", height);
                    // @ts-ignore
                    formData.append("bmi", bmi);

                    console.log("FormData 확인:");
                    formData.forEach((value, key) => {
                        console.log(`${key}: ${value}`);
                    });

                    try {
                        const response = await fetch("/predict", {
                            method: "POST",
                            body: formData,
                        });

                        if (response.ok) {
                            const data = await response.json();
                            onAnalysisComplete(data.result);
                        } else {
                            const errorResponse = await response.json();
                            console.error("서버 응답 오류:", errorResponse);
                        }
                    } catch (uploadError) {
                        console.error("서버 전송 중 오류 발생:", uploadError);
                    }
                }
            }
        );

        widget.open();
    };


    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                    isUploading ? "opacity-50" : ""
                }`}
            >
                {isUploading ? "업로드 중..." : "이미지 업로드 및 분석"}
            </button>
        </div>
    );
};

export default ImageUploaderComponent;
