// import React from "react";
// import FormElements from "@/components/FormElements";
// import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import Dashboard from "@/components/Dashboard/Dashboard";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

// export const metadata: Metadata = {
//     title:
//         "Web Admin BSI - Template",
//     description: "Web Admin BSI",
// };

// const FormElementsPage = () => {
//     return (
//         <DefaultLayout>
//             <div className="flex flex-col gap-10">
//                 {/* <Breadcrumb pageName="Antrian"/> */}
//                 <Dashboard />
//             </div>
//         </DefaultLayout>
//     );
// };

// export default FormElementsPage;


// "use client";


// import React from "react";
// import { useSession } from "next-auth/react"; // Hook untuk cek session
// import { useRouter } from "next/navigation"; // Hook untuk mengarahkan pengguna
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import Dashboard from "@/components/Dashboard/Dashboard";
// import { Metadata } from "next";

// // Metadata untuk halaman
// export const metadata: Metadata = {
//     title: "Web Admin BSI - Template",
//     description: "Web Admin BSI",
// };

// const FormElementsPage = () => {
//     const { data: session, status } = useSession(); // Cek status session
//     const router = useRouter(); // Router untuk pengalihan

//     // Menunggu status loading
//     if (status === "loading") {
//         return <p>Loading...</p>;
//     }

//     // Jika session tidak ada (pengguna belum login), arahkan ke halaman login
//     if (!session) {
//         router.push("/auth/signin");
//         return <p>Redirecting to sign-in...</p>;
//     }

//     // Jika session ada (pengguna sudah login), tampilkan dashboard
//     return (
//         <DefaultLayout>
//             <div className="flex flex-col gap-10">
//                 {/* <Breadcrumb pageName="Antrian"/> */}
//                 <Dashboard />
//             </div>
//         </DefaultLayout>
//     );
// };

// export default FormElementsPage;


import { Metadata } from "next"; // import dari 'next' untuk server-side metadata
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Web Admin BSI - Template",
  description: "Web Admin BSI",
};

const DashboardPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <Dashboard />
      </div>
    </DefaultLayout>
  );
};

export default DashboardPage;