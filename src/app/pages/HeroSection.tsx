"use client";

import Link from "next/link";
import Header from "@/app/componenets/Header";
export default function HeroSection() {
    return (
        <>
            <Header />
            <div className="flex items-center justify-between h-screen px-10 bg-white">
                <div className="max-w-[800px] ml-8">
                    <p className="text-[30px] text-black m-0">체형맞춤형 운동추천</p>
                    <h1 className="text-[80px] font-bold my-4 text-black">BODY : CHECK</h1>
                    <Link href="/myBody" passHref>
                        <button className="px-8 py-4 text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300 mt-5">
                            체형분석 체험해보기
                        </button>
                    </Link>
                </div>
                <img
                    src="/images/mainImage.png"
                    alt="logo"
                    className="w-[500px] h-[500px] mr-8"
                />
            </div>
        </>
    );
}
