"use client"; // Pastikan hanya di sini

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard/Dashboard";
import Auth from "@/components/Login/Auth";

export default function Home() {
  const { data: session, status } = useSession(); 
  const router = useRouter(); 

  if (session) {
    router.push("/dashboard");
    return null; // Tidak merender apa pun sampai pengalihan selesai
  }

  return (
    <Auth />
  );
}


