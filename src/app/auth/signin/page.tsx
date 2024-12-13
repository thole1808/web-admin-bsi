"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  // const router = useRouter();

  // // Redirect to dashboard (beranda) if already authenticated
  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     const token = localStorage.getItem("access_token"); // Simpan token dari OAuth di localStorage
  //     if (token) {
  //       router.push("/dashboard"); // Arahkan ke beranda jika sudah login
  //     } else {
  //       // Cek apakah URL mengandung authorization code
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const code = urlParams.get("code");

  //       if (code) {
  //         await fetchAccessToken(code);
  //       }
  //     }
  //   };

  //   checkAuthentication();
  // }, [router]);

  // // Fetch access token using authorization code
  // const fetchAccessToken = async (authorizationCode: string) => {
  //   try {
  //     const response = await fetch(process.env.NEXT_PUBLIC_OAUTH_ACCESS_TOKEN_URL!, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         grant_type: "authorization_code",
  //         client_id: process.env.NEXT_PUBLIC_BACKOFFICE_ID!,
  //         client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET!,
  //         redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL!,
  //         code: authorizationCode,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Error fetching access token:", errorData);
  //       return;
  //     }

  //     const data = await response.json();
  //     console.log("Access token:", data.access_token);
  //     localStorage.setItem("access_token", data.access_token);
  //     router.push("/beranda"); // Redirect to dashboard
  //   } catch (err) {
  //     console.error("Network error:", err);
  //   }
  // };

  // // Handle form submission (redirect to Auth URL)
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const authUrl = `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}`;
  //   const params = new URLSearchParams({
  //     client_id: process.env.NEXT_PUBLIC_BACKOFFICE_ID!,
  //     redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL!,
  //     response_type: "code",
  //     scope: process.env.NEXT_PUBLIC_BACKOFFICE_SCOPE!,
  //   });
  //   window.location.href = `${authUrl}?${params.toString()}`;
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah form untuk di-submit secara default
    const authUrl = `${process.env.NEXT_PUBLIC_OAUTH_AUTH_URL}`; 
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_BACKOFFICE_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL!,
      response_type: "code", 
      scope: process.env.NEXT_PUBLIC_BACKOFFICE_SCOPE!, 
    });

    // Redirect ke halaman otorisasi OAuth2 dengan parameter yang benar
    window.location.href = `${authUrl}?${params.toString()}`;
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1076"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* SVG Background */}
        </svg>
      </div>

      <div className="bg-gray-100 w-full flex flex-col items-center justify-center">
        <div className="relative z-10 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark max-w-md w-full">
          <div className="flex justify-center bg-transparent mt-5">
            <Image
              src="/images/logo/logo-bsi.png"
              alt="Logo"
              width={100}
              height={100}
              className=""
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="w-full px-8 py-6">
            <form className="mt-1 space-y-6" onSubmit={handleSubmit}>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                style={{ backgroundColor: "#007C80" }}
              >
                Sign in with OAuth2
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
