"use client";

import Link from "next/link";
import Header from "@/app/componenets/Header";
export default function HeroSection() {
    return (
        <div className="w-full min-h-screen overflow-hidden bg-white">
            <Header/>
            <div className="container mx-auto flex items-center justify-between h-screen px-4 lg:px-[5vw] py-[5vh]">
                <div className="max-w-[800px] ml-8 mr-2">
                    <p className="text-[4vw] lg:text-[30px] text-black m-0">체형맞춤형 운동추천</p>
                    <h1 className="text-[10vw] lg:text-[80px] font-bold my-4 text-black">BODY : CHECK</h1>
                    <Link href="/myBody" passHref>
                    <button
                            className="px-8 py-4 text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300 mt-5">
                            체형분석 체험해보기
                        </button>
                    </Link>
                </div>
                <img
                    src="/images/mainImage.png"
                    alt="logo"
                    className="w-[70vw] h-[60vh] lg:w-[50vw] lg:h-[50vh] mr-6 lg:mr-8"
                />
            </div>
        </div>
    );
}
