// // components/SignInButton.tsx
// 'use client';

// import { signIn } from "next-auth/react";

// const SignInButton = () => {
//   return (
//     <button
//       onClick={() => signIn('auth0')}
//       className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//     >
//       Sign in with Auth0
//     </button> 
//   );
// };

// export default SignInButton;



// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// const SignIn: React.FC = () => {

//   return (
//     <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="absolute inset-0">
//         <svg
//           width="100%"
//           height="100%"
//           viewBox="0 0 1920 1076"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-full h-full"
//         >
//           {/* SVG Background */}
//         </svg>
//       </div>

//       <div className="bg-gray-100 w-full flex flex-col items-center justify-center">
//         <div className="relative z-10 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark max-w-md w-full">
//           <div className="flex justify-center bg-transparent mt-5">
//             <Image
//               src="/images/logo/logo-bsi.FDFDF"
//               alt="Logo"
//               width={100}
//               height={100}
//               className=""
//               style={{ backgroundColor: "transparent" }}
//             />
//           </div>
//           <div className="w-full px-8 py-6">
//             <button
//               onClick={() => signIn('auth0')}
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
//               style={{ backgroundColor: "#007C80" }}
//             >
//               Sign in with OAuth2
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


"use client"; // Menandakan bahwa komponen ini adalah Client-Side

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react"; // Import useSession

const SignIn: React.FC = () => {
  const { data: session, status } = useSession(); // Mendapatkan data session dan status
  const router = useRouter(); // Menggunakan router untuk redirect

  useEffect(() => {
    // Jika sudah ada session (token), arahkan ke dashboard
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

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
              src="/images/logo/logo-bsi.SDSD"
              alt="Logo"
              width={100}
              height={100}
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="w-full px-8 py-6">
            {/* Tombol untuk login dengan OAuth */}
            <button
              onClick={() => signIn('auth0')} // Memulai proses login
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
              style={{ backgroundColor: "#007C80" }}
            >
              Sign in with OAuth2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
