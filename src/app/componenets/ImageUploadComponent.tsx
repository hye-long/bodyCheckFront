"use client";

import React, { useEffect, useState } from "react";

interface ImageUploadComponentProps {
    onAnalyze: (uploadedUrl: string) => void; // 분석 요청 콜백
    onImageUpload?: (uploadedUrl: string) => void; // 이미지 업로드 콜백
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({ onAnalyze, onImageUpload }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Cloudinary 스크립트 로드
    useEffect(() => {
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

    // Cloudinary 업로드 처리
    const handleUpload = () => {
        if (!isScriptLoaded) {
            alert("Cloudinary 스크립트가 아직 로드되지 않았습니다.");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
            },
            async (error: any, result: any) => {
                if (error) {
                    console.error("Cloudinary 업로드 중 오류 발생:", error);
                    return;
                }

                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;
                    if (onImageUpload) onImageUpload(uploadedUrl);
                    onAnalyze(uploadedUrl); // 분석 요청
                }
            }
        );

        widget.open();
    };

    return (
        <div className="w-full flex flex-col items-center">
            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                이미지 업로드 및 분석
            </button>
        </div>
    );
};

export default ImageUploadComponent;
