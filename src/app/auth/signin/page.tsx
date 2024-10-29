"use client"

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Signin Page TailAdmin Dashboard Template",
// };

const SignIn: React.FC = () => {
  const router = useRouter(); // Initialize useRouter from next/navigation

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Simulate login logic or call API here

    // Redirect to the dashboard
    router.push("/dashboard");
  };

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
      {/* Image above the form */}
      {/* Form Panel */}
      <div className="bg-gray-100 w-full flex flex-col items-center justify-center"> {/* Background for the entire section */}
        {/* Image above the form */}
        <div className="flex justify-center mb-10 bg-transparent"> {/* Center the image */}
          <img
            src="/images/logo/Bank_Syariah_Indonesia.svg" // Replace with your image path
            alt="No Images"
            width={170} // Set the desired width
            height={170} // Set the desired height
            className="rounded-lg" // Removed w-full to prevent it from taking the full width
            style={{ backgroundColor: 'transparent' }} // Ensure background is transparent
          />
        </div>

        <div className="relative z-10 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark max-w-md w-full">
          <div className="w-full px-8 py-6">
            {/* <h2 className="text-center text-3xl font-bold text-gray-700 mb-6">
        Sign In
      </h2> */}
            <form className="mt-1 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-600 flex items-center"
                >
                  {/* New Email Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                      fill="#080341"
                    />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="flex items-center mb-2 text-sm font-medium text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder=""
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
              Don&#39;t have an account?
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
