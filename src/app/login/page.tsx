"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaFingerprint } from "react-icons/fa";

const SignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/images/bg-login/bg-login-bsi.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1076"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* SVG content here (if necessary) */}
        </svg>
      </div>

      {/* Login Form Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="relative z-20 rounded-lg border border-gray-200 bg-white shadow dark:border-strokedark dark:bg-boxdark max-w-lg w-full p-6">
          <div className="flex justify-between bg-transparent">
            <div>
              <Image
                src="/images/logo/bsi.svg"
                alt="Logo"
                width={160}
                height={160}
                style={{ backgroundColor: "transparent" }}
              />
              <div className="text-teal-600 font-semibold mt-1">QMS Webadmin</div>
            </div>
            <div className="text-xs font-medium">Version 1.0</div>
          </div>
            <button
              onClick={() => signIn('auth0')} // Memulai proses login
              type="submit"
              className="mt-6 w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FaFingerprint className="w-5 h-5" /> Sign in with OAuth2
            </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
