// "use client";
// import "jsvectormap/dist/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
// // import "@/css/satoshi.css";
// import "@/css/style.css";
// import React, { useEffect, useState } from "react";
// import Loader from "@/components/common/Loader";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // const pathname = usePathname();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>
//         <div className="dark:bg-boxdark-2 dark:text-bodydark">
//           {loading ? <Loader /> : children}
//         </div>  
//       </body>
//     </html>
//   );
// }


"use client";

import { SessionProvider } from "next-auth/react"; // Import SessionProvider dari next-auth
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
// import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          {/* Menambahkan SessionProvider untuk membungkus aplikasi */}
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
