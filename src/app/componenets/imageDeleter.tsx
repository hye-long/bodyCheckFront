// 이미지 삭제 컴포넌트

import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";

interface ImageDeleterProps {
    uploadedImages: any[];
    refreshImages: () => void; // 이미지 고르기
}

const ImageDeleter: React.FC<ImageDeleterProps> = ({ uploadedImages, refreshImages }) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // 토글 이미지 고르기
    const toggleSelectImage = (imageId: string) => {
        setSelectedImages((prev) =>
            prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
        );
    };

    // 모두 선택
    const selectAllImages = () => {
        if (selectedImages.length === uploadedImages.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(uploadedImages.map((img) => img.id));
        }
    };

    // 삭제
    const deleteSelectedImages = async () => {
        try {
            await Promise.all(
                selectedImages.map((imageId) => deleteDoc(doc(firestore, "images", imageId)))
            );
            setSelectedImages([]);
            refreshImages(); // 리프레시
        } catch (error) {
            console.error("Error :", error);
        }
    };

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={selectAllImages}
                    className="px-4 py-2  rounded-lg text-black hover:gray-400"
                >
                    {selectedImages.length === uploadedImages.length ? "모두 선택 해제" : "X"}
                </button>
                {selectedImages.length > 0 && (
                    <button
                        onClick={deleteSelectedImages}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        삭제 ({selectedImages.length})
                    </button>
                )}
            </div>

        </div>
    );
};

export default ImageDeleter;
