import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Auth from "@/components/Login/Auth";

export const metadata: Metadata = {
  title:
    "Web Admin BSI - Template",
  description: "Web Admin BSI",
};

export default function Home() {
  return (
    
    <Auth/>
  );
}

//  GOOD
// "use client";

// import { useSession } from "next-auth/react"; // Import useSession untuk mengecek sesi
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import Auth from "@/components/Login/Auth";

// export default function Home() {
//   const { data: session, status } = useSession(); // Ambil data session
//   const router = useRouter();

//   useEffect(() => {
//     // Jika sesi ada, arahkan ke dashboard
//     if (session) {
//       router.push("/dashboard");
//     }
//   }, [session, router]);

//   if (status === "loading") {
//     return <p>Loading...</p>; // Tampilkan loading saat status masih loading
//   }

//   if (!session) {
//     return (
//       <DefaultLayout>
//         <Auth /> {/* Menampilkan halaman login jika tidak ada sesi */}
//       </DefaultLayout>
//     );
//   }

//   return null; // Jangan render apapun jika ada sesi, karena kita sudah mengarahkan ke dashboard
// }
  