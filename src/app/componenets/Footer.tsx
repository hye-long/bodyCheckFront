'use client';

import React from "react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-gray-400 py-24 px-10 flex justify-between items-center">
            {/* 왼쪽 콘텐츠 */}
            <div className="max-w-5xl w-full flex items-center justify-between">
                {/* BODY:CHECK와 연락처 */}
                <div className="text-left">
                    <h2 className="text-xl text-white mb-16">BODY : CHECK</h2>

                    <div>
                        <span className="text-gray-500 block ">문의사항 hyelong20630@gmail.com</span>
                        <span className="text-gray-500 block ">대표자 박주환</span>
                        <span className="text-gray-500 block mb-2">대표자 전화번호 010-7110-8128</span>
                    </div>
                    <a
                        href="https://www.instagram.com/hxewwne/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-300"
                    >
                        <FaInstagram size={24} className="mr-2"/>
                    </a>
                    <p className="mt-8 text-sm text-gray-600">
                        copyright(c) BODY:CHECK All rights reserved
                    </p>
                </div>


            </div>
        </footer>
    );
}
