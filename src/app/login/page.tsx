"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaExclamation, FaFingerprint } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Label from "@/components/Forms/Label";

const SignIn: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      const response = await fetch(`/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      const result = await response.json();
    
      if (result.success) {
        // 💥 Clear semua localStorage sebelum simpan ulang
        localStorage.clear();
    
        localStorage.setItem("user-profile", JSON.stringify(result.data));
    
        const roleResponse = await fetch(`/api/roles/${result.data.role.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        const resultRole = await roleResponse.json();
    
        if (resultRole.success) {
          localStorage.setItem("user-role", JSON.stringify(resultRole.data));
        }
      }
    
      router.push("/dashboard");
    } else {
      setErrorMsg("Login gagal");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (errorMsg) {
      const timeout = setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [errorMsg]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-yellow-200 px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">

        {/* Ilustrasi */}
        <div className="md:w-1/2 bg-gradient-to-br from-yellow-100 to-teal-200 flex items-center justify-center">
          <Image
            src="/images/illustration/illustration.png"
            alt="Ilustrasi Sistem Antrian"
            width={400}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Form Login */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between mb-6">
              <div>
                <div className="text-teal-600 font-semibold mt-1 text-lg">
                  QMS Webadmin
                </div>
                <div className="text-gray-500 text-sm">
                  Sistem Manajemen Antrian Terpusat
                </div>
              </div>
              <Image
                src="/images/logo/bsi.svg"
                alt="Logo"
                width={120}
                height={120}
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                {errorMsg && (
                  <div className="relative flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 shadow-md animate-fade-in transition-opacity duration-500">
                    <div className="pt-1">
                      <FaExclamation className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 text-sm leading-snug">
                      <p className="font-semibold">{errorMsg}</p>
                      <p className="text-xs text-red-600">Periksa email dan password Anda.</p>
                    </div>
                    <button
                      onClick={() => setErrorMsg("")}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 ring-gray-300 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Kata Sandi</Label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Kata Sandi"
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 ring-gray-300 focus:ring-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-2.5 right-3 text-gray-500 hover:text-teal-600 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="mt-0.5" /> : <FiEye className="mt-0.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 text-lg font-semibold 
          ${isLoading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 py-0.5">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-white">Mohon tunggu...</span>
                  </div>
                ) : (
                  <>
                    <FaFingerprint className="w-5 h-5" /> Masuk
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-700">
            © PT. Bank Syariah Indonesia. Seluruh hak cipta dilindungi.<br /> Versi Aplikasi 1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;