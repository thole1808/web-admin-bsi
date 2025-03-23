"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaFingerprint } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Label from "@/components/Forms/Label";

const SignIn: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setErrorMsg("Account not found. Please check your email and password.");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: 'url(/images/bg-login/bg-login-bsi.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
          {/* SVG content here */}
        </svg>
      </div>

      {/* Login Form Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="relative z-20 rounded-lg border border-gray-200 bg-white shadow max-w-lg w-full p-6">
          <div className="flex justify-between bg-transparent">
            <div>
              <Image
                src="/images/logo/bsi.svg"
                alt="Logo"
                width={160}
                height={160}
                style={{ backgroundColor: "transparent" }}
              />
              <div className="text-teal-600 font-semibold mt-1">
                QMS Webadmin
              </div>
            </div>
            <div className="text-sm font-medium">Version 1.0</div>
          </div>

          {/* Form Login Email & Password */}
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded outline-0 ring-0 focus:ring-1 ring-gray-300 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded outline-0 ring-0 focus:ring-1 ring-gray-300 focus:ring-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-gray-500 hover:text-teal-600 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="mt-8 w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FaFingerprint className="w-5 h-5" /> Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;