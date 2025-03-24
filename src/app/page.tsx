"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Auth from "@/components/Pages/Login/Auth";
import useAutoLogout from "@/hooks/useAutoLogout";

export default function Home() {
  const { data: session, status } = useSession(); 
  const router = useRouter(); 
  useAutoLogout();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <Auth />
  );
}
