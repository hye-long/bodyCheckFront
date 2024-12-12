"use client";

import React, { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import SingleBarChart from "@/app/componenets/BarChart";
import AnalysisResultTable from "@/app/componenets/AnalysisResultTable";

const RecordExercise = () => {
    const userId = useAuthStore((state) => state.userId);
    const [currentImage, setCurrentImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<number[] | null>(null);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [height, setHeight] = useState<string>("");
    const [bmi, setBmi] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    const selectedLabels = [
        "머리둘레",
        "목둘레",
        "허리둘레",
        "엉덩이둘레",
        "무릎둘레",
        "장딴지둘레",
        "어깨사이 너비",
    ];

    const fetchUserData = async () => {
        try {
            const userDoc = await getDocs(
                query(collection(firestore, "users"), where("id", "==", userId))
            );

            const userData = userDoc.docs[0]?.data();
            if (userData) {
                setHeight(userData.height || "");
                setBmi(userData.bmi || "");
                setChartData([
                    { name: "BMI", value: userData.bmi },
                    { name: "체중", value: userData.weight },
                    { name: "체지방률", value: userData.bodyFat },
                ]);
            }
        } catch (error) {
            console.error("사용자 데이터 가져오기 실패:", error);
        }
    };

    const fetchUploadedImages = async () => {
        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
            const snapshot = await getDocs(q);

            const images = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate().toLocaleString(),
            }));

            setUploadedImages(images);
        } catch (error) {
            console.error("Firestore에서 이미지 가져오기 실패:", error);
        }
    };

    const fetchImageDetails = async (imageId: string) => {
        try {
            const docRef = doc(firestore, "images", imageId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setAnalysisResult(data.analysisResult);
                setChartData([
                    { name: "BMI", value: data.analysisResult[0] || 0 },
                    { name: "체중", value: data.analysisResult[1] || 0 },
                ]);
                setSelectedImage({ ...data, timestamp: data.timestamp.toDate().toLocaleString() });
            } else {
                console.error("이미지 데이터를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("Firestore에서 이미지 데이터 로드 중 오류 발생:", error);
        }
    };

    const handleImageUpload = () => {
        if (!window.cloudinary) {
            alert("Cloudinary 스크립트가 로드되지 않았습니다.");
            return;
        }

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
                    setCurrentImageUrl(uploadedUrl);

                    const fileBlob = await fetch(uploadedUrl).then((res) => res.blob());
                    const file = new File([fileBlob], "uploaded_image.jpg", { type: fileBlob.type });
                    setCurrentImage(file);
                }
            }
        );

        widget.open();
    };

    const handleAnalyze = async () => {
        if (!currentImage || !height || !bmi) {
            alert("이미지 업로드 후 분석을 진행해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("image", currentImage);
        formData.append("height", height);
        formData.append("bmi", bmi);

        setIsAnalyzing(true);

        try {
            const response = await fetch("/predict", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data.result);

                await addDoc(collection(firestore, "images"), {
                    userId,
                    imageUrl: currentImageUrl,
                    analysisResult: data.result,
                    timestamp: new Date(),
                });

                fetchUploadedImages();
            } else {
                console.error("서버 응답 오류:", await response.text());
            }
        } catch (error) {
            console.error("분석 요청 중 오류 발생:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchUploadedImages();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-wrap h-auto bg-gray-100">
                <div className="w-full lg:w-1/3 p-4">
                    <h2 className="text-lg lg:text-xl font-bold mb-2">사진 업로드</h2>
                    <p className="text-sm mb-4">사진 업로드 후 분석하기를 눌러주세요</p>
                    <img
                        src="/images/analyzeOne.png"
                        alt="미니어처"
                        className="w-[30vw] h-[30vw] rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {selectedLabels.map((label, index) => (
                            <div key={index} className="text-sm flex justify-between">
                                <span className="font-medium text-lg">{label}:</span>
                                <span className="text-gray-700">
                                    {analysisResult?.[index]?.toFixed(2) || " "}
                                </span>
                            </div>
                        ))}
                    </div>
                    {selectedImage && (
                        <div className="mt-4 text-gray-600">
                            <p>저장된 날짜: {selectedImage.timestamp}</p>
                        </div>
                    )}
                    <button
                        onClick={handleImageUpload}
                        className="w-full px-4 mt-10 py-2 bg-gray-100 border-2 text-black rounded-lg hover:bg-blue-700"
                    >
                        이미지 업로드
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !currentImage}
                        className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-green-700 mt-4"
                    >
                        {isAnalyzing ? "분석 중..." : "분석하기"}
                    </button>
                </div>

                <div className="w-full lg:w-1/3 p-4">
                    <h3 className="text-xl font-bold">BMI 차트</h3>
                    <SingleBarChart
                        label="BMI"
                        value={chartData[0]?.value || 0}
                        color="gray-100"
                        maxScale={50}
                        stepSize={5}
                    />
                    <h3 className="text-xl font-bold mt-4">체중 차트</h3>
                    <SingleBarChart
                        label="체중"
                        value={chartData[1]?.value || 0}
                        color="gray-100"
                        maxScale={100}
                        stepSize={10}
                    />
                    <h3 className="text-2xl font-bold mt-4">분석결과</h3>
                    <AnalysisResultTable analysisResult={analysisResult} />
                </div>

                <div className="w-full lg:w-1/3 p-4 overflow-y-scroll">
                    <h2 className="text-xl font-bold mb-4">저장된 사진</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {uploadedImages.map((img) => (
                            <div key={img.id} className="relative flex flex-col items-center">
                                <img
                                    src={img.imageUrl}
                                    alt="저장된 사진"
                                    className="w-full h-56 object-cover rounded-lg cursor-pointer"
                                    onClick={() => fetchImageDetails(img.id)}
                                />
                                <p className="text-sm mt-2 text-gray-600">{img.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RecordExercise;
