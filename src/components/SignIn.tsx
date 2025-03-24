"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaFingerprint } from "react-icons/fa";

const SignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setErrorMsg("Invalid email or password.");
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
      {/* Background SVG (opsional) */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1076"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* SVG content */}
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="relative z-20 rounded-lg border border-gray-200 bg-white shadow max-w-lg w-full p-6">
          {/* Logo + Title */}
          <div className="flex justify-between items-start">
            <div>
              <Image
                src="/images/logo/bsi.svg"
                alt="Logo"
                width={160}
                height={160}
              />
              <div className="text-teal-600 font-semibold mt-1">
                QMS Webadmin
              </div>
            </div>
            <div className="text-sm font-medium">Version 1.0</div>
          </div>

          {/* OAuth2 Button */}
          <button
            onClick={() => signIn("auth0")}
            type="button"
            className="mt-6 w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <FaFingerprint className="w-5 h-5" /> Sign in with OAuth2
          </button>

          {/* Divider */}
          <div className="my-6 text-center text-gray-500">
            atau login dengan email
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-8">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            {errorMsg && (
              <div className="text-red-600 text-sm">{errorMsg}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 font-semibold"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;