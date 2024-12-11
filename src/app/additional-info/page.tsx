// 추가정보

'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
