import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

const SignIn: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Background SVG */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1076"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <mask
            id="mask0_415_2672"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1920"
            height="1076"
          >
            <rect
              x="0"
              y="1076"
              width="1076"
              height="1920"
              transform="rotate(-90 0 1076)"
              fill="#D5EAE8"
            />
          </mask>
          <g mask="url(#mask0_415_2672)">
            <g filter="url(#filter0_f_415_2672)">
              <circle cx="1586" cy="405" r="440" fill="#A0D3D4" />
            </g>
            <g filter="url(#filter1_f_415_2672)">
              <circle cx="312" cy="432" r="432" fill="#FAC87D" />
            </g>
            <g filter="url(#filter2_f_415_2672)">
              <circle cx="861" cy="1034" r="432" fill="#E1FBC5" />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_415_2672"
              x="746"
              y="-435"
              width="1680"
              height="1680"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="200"
                result="effect1_foregroundBlur_415_2672"
              />
            </filter>
            <filter
              id="filter1_f_415_2672"
              x="-520"
              y="-400"
              width="1664"
              height="1664"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="200"
                result="effect1_foregroundBlur_415_2672"
              />
            </filter>
            <filter
              id="filter2_f_415_2672"
              x="29"
              y="202"
              width="1664"
              height="1664"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="200"
                result="effect1_foregroundBlur_415_2672"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Sign In Form */}
      <div className="relative z-10 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark max-w-md w-full">
        <div className="w-full px-8 py-12">
          <h2 className="text-center text-3xl font-bold text-gray-700 mb-6">
            Sign In
          </h2>
          <form className="mt-4 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
