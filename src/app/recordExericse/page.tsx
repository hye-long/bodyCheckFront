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
    const userId = useAuthStore((state) => state.userId); // 로그인된 사용자 ID
    const [currentImage, setCurrentImage] = useState<File | null>(null); // 업로드된 이미지 파일
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // 업로드된 이미지 URL
    const [analysisResult, setAnalysisResult] = useState<number[] | null>(null); // 서버 분석 결과
    const [uploadedImages, setUploadedImages] = useState<any[]>([]); // Firestore에서 가져온 저장된 이미지
    const [chartData, setChartData] = useState<any[]>([]); // BarChart 데이터 (BMI, 체중, 체지방률)
    const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 중 상태
    const [height, setHeight] = useState<string>(""); // Firestore에서 가져온 키
    const [bmi, setBmi] = useState<string>(""); // Firestore에서 가져온 BMI
    const [selectedImage, setSelectedImage] = useState<any | null>(null); // 클릭된 이미지 데이터

    const selectedLabels = [
        "머리둘레",
        "목둘레",
        "허리둘레",
        "엉덩이둘레",
        "무릎둘레",
        "장딴지둘레",
        "어깨사이 너비",
    ];

    // Firestore에서 사용자 데이터 가져오기
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

    // Firestore에서 저장된 이미지 목록 가져오기
    const fetchUploadedImages = async () => {
        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
            const snapshot = await getDocs(q);

            const images = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate().toLocaleString(), // 타임스탬프 변환
            }));

            setUploadedImages(images);
        } catch (error) {
            console.error("Firestore에서 이미지 가져오기 실패:", error);
        }
    };

    // Firestore에서 이미지 데이터 로드
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

    // Cloudinary 이미지 업로드 및 서버로 분석 요청
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

                    // 이미지 파일 가져오기
                    const fileBlob = await fetch(uploadedUrl).then((res) => res.blob());
                    const file = new File([fileBlob], "uploaded_image.jpg", { type: fileBlob.type });
                    setCurrentImage(file);

                    console.log("Cloudinary 업로드 완료:", uploadedUrl);
                }
            }
        );

        widget.open();
    };

    // 서버로 분석 요청
    const handleAnalyze = async () => {
        if (!currentImage || !height || !bmi) {
            alert("이미지 업로드 후 분석을 진행해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("image", currentImage); // 이미지 파일 추가
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

                // Firestore에 분석 결과 저장
                await addDoc(collection(firestore, "images"), {
                    userId,
                    imageUrl: currentImageUrl,
                    analysisResult: data.result,
                    timestamp: new Date(),
                });

                fetchUploadedImages(); // Firestore 목록 갱신
            } else {
                console.error("서버 응답 오류:", await response.text());
            }
        } catch (error) {
            console.error("분석 요청 중 오류 발생:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchUserData();
        fetchUploadedImages();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-wrap lg:flex-nowrap h-auto bg-gray-100">
                {/* 왼쪽: 이미지 업로드 및 분석 */}
                <div className="w-full lg:w-1/3 p-4">
                    <h2 className="text-xl font-bold mb-2">사진 업로드</h2>
                    <p className="text-sm mb-4"> 사진 업로드 후 분석하기를 눌러주세요 </p>
                    <div className="flex flex-wrap md:flex-nowrap relative items-start gap-4">
                        <img
                            src="/images/analyzeOne.png" // 미니어처 이미지 고정
                            alt="미니어처"
                            className="w-full md:w-1/2 lg:w-full border rounded-lg"
                        />
                        <div className="w-full md:pl-6 flex flex-col gap-4">
                            {selectedLabels.map((label, index) => (
                                <div key={index} className="flex justify-between items-center gap-2">
                                    <span className="font-medium text-lg">{label}:</span>
                                    <span className="text-gray-700">
                                        {analysisResult && analysisResult[index] !== undefined
                                            ? analysisResult[index].toFixed(2)
                                            : " "}
                                    </span>
                                </div>
                            ))}
                        </div>
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

                {/* 가운데: 분석 결과 및 Bar Chart */}
                <div className="w-full lg:w-1/3 p-4">
                    <div className="mt-4">
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
                </div>

                {/* 오른쪽: 저장된 이미지 목록 */}
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
