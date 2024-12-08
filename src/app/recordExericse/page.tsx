"use client";

import React, { useState, useEffect } from "react";
import {collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc} from "firebase/firestore";
import { firestore } from "@/app/firestore/firebase";
import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "@/app/componenets/dashboardLayout";
import SingleBarChart from "@/app/componenets/BarChart";

const RecordExercise = () => {
    const userId = useAuthStore((state) => state.userId); // 로그인된 사용자 ID
    const [currentImage, setCurrentImage] = useState<string | null>(null); // 현재 업로드된 이미지 URL
    const [analysisResult, setAnalysisResult] = useState<number[] | null>(null); // 서버 분석 결과
    const [uploadedImages, setUploadedImages] = useState<any[]>([]); // Firestore에서 가져온 저장된 이미지
    const [chartData, setChartData] = useState<any[]>([]); // BarChart 데이터 (BMI, 체중, 체지방률)
    const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 중 상태
    const [height, setHeight] = useState<string>(""); // 키 입력
    const [bmi, setBmi] = useState<string>(""); // BMI 입력
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    // Firestore에서 저장된 이미지 목록 가져오기
    const fetchUploadedImages = async () => {
        try {
            const imagesRef = collection(firestore, "images");
            const q = query(imagesRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
            const snapshot = await getDocs(q);

            const images = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUploadedImages(images);
        } catch (error) {
            console.error("Firestore에서 이미지 가져오기 실패:", error);
        }
    };

    // Firestore에서 사용자 데이터 가져오기
    const fetchUserChartData = async () => {
        try {
            const userDoc = await getDocs(
                query(collection(firestore, "users"), where("id", "==", userId))
            );

            const userData = userDoc.docs[0]?.data();
            if (userData) {
                setChartData([
                    { name: "BMI", value: userData.bmi },
                    { name: "체중", value: userData.weight },
                ]);
            }
        } catch (error) {
            console.error("사용자 데이터 가져오기 실패:", error);
        }
    };

    // Cloudinary로 이미지 업로드
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
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary 업로드 오류:", error);
                    return;
                }

                if (result.event === "success") {
                    const uploadedUrl = result.info.secure_url;
                    setCurrentImage(uploadedUrl);
                    await handleAnalyze(uploadedUrl); // 분석 요청
                }
            }
        );

        widget.open();
    };



    // 서버로 분석 요청
    const handleAnalyze = async (imageUrl: string) => {
        if (!imageUrl || !height || !bmi) {
            alert("이미지, 키(cm), BMI를 입력하세요.");
            return;
        }

        setIsAnalyzing(true);

        try {
            const response = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: imageUrl,
                    height,
                    bmi,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data.result);

                // Firestore에 분석 결과 저장
                await addDoc(collection(firestore, "images"), {
                    userId,
                    imageUrl,
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
        fetchUploadedImages();
        fetchUserChartData();
    }, []);

    //이미지 클릭
    const handleImageClick = (imageId: string) => {
        setSelectedImage((prev) => (prev === imageId ? null : imageId)); // 클릭 시 토글
    };

    //이미지 삭제
    const handleDeleteImage = async (imageId: string) => {
        try {
            await deleteDoc(doc(firestore, "images", imageId)); // Firestore에서 삭제
            setUploadedImages((prev) => prev.filter((img) => img.id !== imageId)); // 로컬 상태에서 제거
            setSelectedImage(null); // 선택 상태 초기화
        } catch (error) {
            console.error("이미지 삭제 중 오류 발생:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex h-screen bg-gray-100">
                {/* 왼쪽: 이미지 업로드 및 분석 */}
                <div className="w-1/3  p-4">
                    <h2 className="text-xl font-bold mb-4">사진 업로드</h2>
                    <button
                        onClick={handleImageUpload}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        이미지 업로드
                    </button>
                    <input
                        type="number"
                        placeholder="키(cm)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="block w-full mt-4 px-4 py-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="BMI"
                        value={bmi}
                        onChange={(e) => setBmi(e.target.value)}
                        className="block w-full mt-2 px-4 py-2 border rounded"
                    />
                </div>

                {/* 가운데: 분석 결과 및 Bar Chart */}
                <div className="w-1/3  p-4">
                    <h2 className="text-xl font-bold mb-4">분석 결과</h2>
                    {analysisResult ? (
                        <div>
                            <img
                                src="/images/analyzeBody.png"
                                alt="분석 이미지"
                                className="w-full h-auto mb-4"
                            />
                            <ul>
                                {analysisResult.map((value, index) => (
                                    <li key={index}>
                                        항목 {index + 1}: {value.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>분석 결과가 없습니다. 이미지를 업로드하고 분석을 진행하세요.</p>
                    )}
                    <div className="w-full mt-2">
                        {/* BMI 차트 */}
                        <h2 className="text-lg font-bold mb-2">BMI 차트</h2>
                        <div className="w-full" style={{height: "80px"}}> {/* Slim chart container */}
                            <SingleBarChart label="BMI" value={chartData[0]?.value || 0} color="#4CAF50" maxScale={50}
                                            stepSize={5}/>
                        </div>

                        {/* 체중 차트 */}
                        <h2 className="text-lg font-bold mt-8 ">체중 차트</h2>
                        <div className="w-full mb-2" style={{height: "80px"}}> {/* Slim chart container */}
                            <SingleBarChart label="체중" value={chartData[1]?.value || 0} color="#FFC107" maxScale={100}
                                            stepSize={10}/>
                        </div>

                        {/* 체지방률 차트 */}
                        <h2 className="text-lg font-bold mt-10 mb-2">체지방률 차트</h2>
                        <div className="w-full" style={{height: "80px"}}> {/* Slim chart container */}
                            <SingleBarChart label="체지방률" value={chartData[2]?.value || 0} color="#03A9F4"/>
                        </div>
                    </div>

                </div>

                {/* 오른쪽: 저장된 사진 */}
                <div className="w-1/3  p-4 overflow-y-scroll">
                    <h2 className="text-xl font-bold mb-4">저장된 사진</h2>
                    <div className="grid grid-cols-2 gap-4"> {/* 2열 그리드 레이아웃 */}
                        {uploadedImages.map((img) => (
                            <div
                                key={img.id}
                                className="relative flex flex-col items-center"
                            >
                                {/* 이미지 */}
                                <img
                                    src={img.imageUrl}
                                    alt="저장된 사진"
                                    className="w-full h-56 object-cover rounded-lg cursor-pointer"
                                    onClick={() => handleImageClick(img.id)} // 클릭하면 선택 상태 토글
                                />

                                {/* 분석 결과 */}
                                <p className="text-sm text-gray-700 mt-2">
                                </p>

                                {/* 삭제 버튼 */}
                                {selectedImage === img.id && ( // 선택된 이미지일 때만 삭제 버튼 표시
                                    <button
                                        className="absolute top-2 right-2 px-3 py-1  bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                                        onClick={() => handleDeleteImage(img.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </DashboardLayout>
    );
};

export default RecordExercise;
