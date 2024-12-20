// import React from "react";
// import Link from "next/link";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
// import { usePathname } from "next/navigation";

// const SidebarItem = ({ item, pageName, setPageName }: any) => {
//   const handleClick = () => {
//     const updatedPageName =
//       pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
//     return setPageName(updatedPageName);
//   };

//   const pathname = usePathname();

//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`} style={{ color: "#00BFB2" }}
//       />

//       <Link
//         href={item.route}
//         onClick={handleClick}
//         className={`${
//           isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//         } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  

//         style={{ color: "#00BFB2" }} // Menambahkan warna teks hijau sesuai permintaan
//       >
//         {item.icon}
//         {item.label}
//         {item.children && (
//           <svg
//             // ... (svg code)
//           />
//         )}
//       </Link>

//       {item.children && (
//         <div
//           className={`translate transform overflow-hidden ${
//             pageName !== item.label.toLowerCase() && "hidden"
//           }`}
//         >
//           <SidebarDropdown item={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React from "react";
// import Link from "next/link";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
// import { usePathname } from "next/navigation";

// const SidebarItem = ({ item, pageName, setPageName }: any) => {
//   const handleClick = () => {
//     const updatedPageName =
//       pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
//     return setPageName(updatedPageName);
//   };

//   const pathname = usePathname();

//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`} style={{ color: "#00BFB2" }}
//       />

//       {/* Conditional rendering for Link */}
//       {item.route ? (
//         <Link
//           href={item.route}
//           onClick={handleClick}
//           className={`${
//             isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  

//           style={{ color: "#00BFB2" }} // Menambahkan warna teks hijau sesuai permintaan
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg
//               // ... (svg code)
//             />
//           )}
//         </Link>
//       ) : (
//         <div
//           className={`${
//             isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out`}
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg
//               // ... (svg code)
//             />
//           )}
//         </div>
//       )}

//       {item.children && (
//         <div
//           className={`translate transform overflow-hidden ${
//             pageName !== item.label.toLowerCase() && "hidden"
//           }`}
//         >
//           <SidebarDropdown item={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;



// import React, { useState } from "react";
// import Link from "next/link";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
// import { usePathname } from "next/navigation";

// const SidebarItem = ({ item, pageName, setPageName }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Local state to control submenu visibility

//   const handleClick = () => {
//     const updatedPageName =
//       pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
//     setPageName(updatedPageName); // Update page name based on the active menu item

//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle submenu visibility when item has children
//     }
//   };

//   const pathname = usePathname();

//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   return (
//     <li className="relative mb-2">
//       {/* Left hover line */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//         style={{ color: "#00BFB2" }}
//       />

//       {/* Conditional rendering for Link */}
//       <div>
//         {item.route ? (
//           <Link
//             href={item.route}
//             onClick={handleClick}
//             className={`${
//               isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//             } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  
//             style={{ color: "#00BFB2" }} // Adding green text color
//           >
//             {item.icon}
//             {item.label}
//             {item.children && (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className="bi bi-chevron-down"
//                 viewBox="0 0 16 16"
//               >
//                 <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414L8 10.414 4.293 6.707a1 1 0 0 1 0-1.414z" />
//               </svg>
//             )}
//           </Link>
//         ) : (
//           <div
//             className={`${
//               isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//             } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out`}
//           >
//             {item.icon}
//             {item.label}
//             {item.children && (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 className="bi bi-chevron-down"
//                 viewBox="0 0 16 16"
//               >
//                 <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414L8 10.414 4.293 6.707a1 1 0 0 1 0-1.414z" />
//               </svg>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Show submenu if item has children and it's active */}
//       {item.children && isOpen && (
//         <div className={`pl-4 transition-all duration-300 ease-in-out`}>
//           <SidebarDropdown item={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;



// import React, { useState } from "react";
// import Link from "next/link";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
// import { usePathname } from "next/navigation";

// const SidebarItem = ({ item, pageName, setPageName }: any) => {
//   // State untuk menangani apakah submenu terbuka atau tidak
//   const [isOpen, setIsOpen] = useState(false);

//   // Fungsi untuk menangani klik item menu
//   const handleClick = () => {
//     const updatedPageName =
//       pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
//     setPageName(updatedPageName); // Mengupdate nama halaman

//     // Jika item memiliki children, toggle submenu
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle submenu
//     }
//   };

//   const pathname = usePathname();

//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//         style={{ color: "#00BFB2" }}
//       />

//       {/* Link atau div yang tidak memiliki route */}
//       {item.route ? (
//         <Link
//           href={item.route}
//           onClick={handleClick}
//           className={`${
//             isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  
//           style={{ color: "#00BFB2" }}
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               fill="currentColor"
//               className="bi bi-chevron-down"
//               viewBox="0 0 16 16"
//             >
//               <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414L8 10.414 4.293 6.707a1 1 0 0 1 0-1.414z" />
//             </svg>
//           )}
//         </Link>
//       ) : (
//         <div
//           className={`${
//             isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out`}
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               fill="currentColor"
//               className="bi bi-chevron-down"
//               viewBox="0 0 16 16"
//             >
//               <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414L8 10.414 4.293 6.707a1 1 0 0 1 0-1.414z" />
//             </svg>
//           )}
//         </div>
//       )}

//       {/* Menampilkan submenu jika item memiliki children dan isOpen true */}
//       {item.children && isOpen && (
//         <div className={`pl-4 transition-all duration-300 ease-in-out`}>
//           <SidebarDropdown item={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown"; // Pastikan komponen ini ada

// const SidebarItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Menyimpan status apakah sub-menu terbuka
//   const pathname = usePathname();
  
//   // Fungsi untuk menandakan item yang sedang aktif
//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   const handleClick = () => {
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle sub-menu
//     }
//   };

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//       />
      
//       {/* Menangani item dengan dan tanpa sub-menu */}
//       <div>
//         <Link
//           href={item.route || "#"} // Jika item memiliki sub-menu, hanya tampilkan div
//           onClick={handleClick}
//           className={`${
//             isItemActive ? "bg-transparent dark:bg-meta-4" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg className="ml-auto w-4 h-4 transform transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
//               <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
//             </svg>
//           )}
//         </Link>
//       </div>

//       {/* Menampilkan sub-menu jika ada */}
//       {item.children && isOpen && (
//         <div className="pl-6 mt-2">
//           <SidebarDropdown items={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown"; // Pastikan komponen ini ada

// const SidebarItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Menyimpan status apakah sub-menu terbuka
//   const pathname = usePathname();
  
//   // Fungsi untuk menandakan item yang sedang aktif
//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   const handleClick = (e: React.MouseEvent) => {
//     e.preventDefault(); // Prevent default behavior of redirecting page
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle sub-menu
//     }
//   };

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//       />
      
//       {/* Menangani item dengan dan tanpa sub-menu */}
//       <div>
//         <a
//           href={item.route || "#"} // Tidak akan redirect jika tidak ada route
//           onClick={handleClick}
//           className={`${
//             isItemActive ? "bg-transparent dark:bg-meta-4" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg className="ml-auto w-4 h-4 transform transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
//               <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
//             </svg>
//           )}
//         </a>
//       </div>

//       {/* Menampilkan sub-menu jika ada */}
//       {item.children && isOpen && (
//         <div className="pl-6 mt-2">
//           <SidebarDropdown items={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown"; // Pastikan komponen ini ada

// const SidebarItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Menyimpan status apakah sub-menu terbuka
//   const pathname = usePathname();

//   // Fungsi untuk menandakan item yang sedang aktif
//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   // Fungsi untuk menangani klik pada item menu utama
//   const handleItemClick = (e: React.MouseEvent) => {
//     e.preventDefault(); // Prevent default behavior of redirecting page
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle sub-menu hanya jika item utama diklik
//     }
//   };

//   // Fungsi untuk menangani klik pada item sub-menu (tidak menutup sub-menu)
//   const handleSubItemClick = (e: React.MouseEvent) => {
//     // Prevent default behavior jika ingin menampilkan konten lebih lanjut tanpa menutup sub-menu
//     e.stopPropagation();
//   };

//   return (
//     <li className="relative mb-2">
//       {/* Garis hover di sebelah kiri */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//       />
      
//       {/* Menangani item dengan dan tanpa sub-menu */}
//       <div>
//         <a
//           href={item.route || "#"} // Tidak akan redirect jika tidak ada route
//           onClick={handleItemClick} // Klik pada item utama
//           className={`${
//             isItemActive ? "bg-transparent dark:bg-meta-4" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg className="ml-auto w-4 h-4 transform transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
//               <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
//             </svg>
//           )}
//         </a>
//       </div>

//       {/* Menampilkan sub-menu jika ada */}
//       {item.children && isOpen && (
//         <div className="pl-6 mt-2">
//           <SidebarDropdown items={item.children} onSubItemClick={handleSubItemClick} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown"; // Pastikan komponen ini ada

// const SidebarItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Status apakah sub-menu terbuka
//   const pathname = usePathname();

//   // Fungsi untuk mengecek apakah item aktif
//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   // Fungsi untuk menangani klik pada item utama
//   const handleItemClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle sub-menu
//     } else {
//       window.location.href = item.route || "#"; // Redirect ke halaman
//     }
//   };

//   return (
//     <li className="relative mb-2">
//       {/* Indikator aktif */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       {/* Menu utama */}
//       <div>
//         <a
//           href={item.route || "#"}
//           onClick={handleItemClick}
//           className={`${
//             isItemActive ? "bg-transparent dark:bg-meta-4" : ""
//           } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
//         >
//           {item.icon}
//           {item.label}
//           {item.children && (
//             <svg
//               className={`ml-auto w-4 h-4 transform transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : ""
//               }`}
//             >
//               <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
//             </svg>
//           )}
//         </a>
//       </div>

//       {/* Sub-menu */}
//       {item.children && isOpen && (
//         <div className="pl-6 mt-2">
//           <SidebarDropdown items={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;


// import React, { useState } from "react";
// import { usePathname } from "next/navigation";
// import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

// const SidebarItem = ({ item }: any) => {
//   const [isOpen, setIsOpen] = useState(false); // Status apakah sub-menu terbuka
//   const pathname = usePathname();

//   // Fungsi untuk mengecek apakah item aktif
//   const isActive = (item: any) => {
//     if (item.route === pathname) return true;
//     if (item.children) {
//       return item.children.some((child: any) => isActive(child));
//     }
//     return false;
//   };

//   const isItemActive = isActive(item);

//   // Pastikan sub-menu terbuka jika ada sub-item aktif
//   React.useEffect(() => {
//     if (isItemActive) {
//       setIsOpen(true);
//     }
//   }, [isItemActive]);

//   // Fungsi untuk menangani klik pada item utama
//   const handleItemClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (item.children) {
//       setIsOpen(!isOpen); // Toggle sub-menu
//     } else if (item.route) {
//       window.location.href = item.route; // Redirect ke halaman
//     }
//   };

//   return (
//     <li className="relative mb-2">
//       {/* Indikator aktif */}
//       <div
//         className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
//           isItemActive ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       {/* Item utama */}
//       <div
//         onClick={handleItemClick}
//         className={`${
//           isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
//         } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out cursor-pointer hover:bg-graydark dark:hover:bg-meta-4`}
//         style={{ color: "#00BFB2" }}
//       >
//         {item.icon}
//         {item.label}
//         {item.children && (
//           <svg
//             className={`ml-auto h-4 w-4 transform transition-transform ${
//               isOpen ? "rotate-90" : ""
//             }`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         )}
//       </div>

//       {/* Sub-menu */}
//       {item.children && isOpen && (
//         <div className="mt-2 pl-4">
//           <SidebarDropdown item={item.children} />
//         </div>
//       )}
//     </li>
//   );
// };

// export default SidebarItem;



import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import Link from "next/link";  // Impor Link dari next/link

const SidebarItem = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const activeClass = isActive(item) ? "bg-gray-200 text-blue-700" : "text-gray-900";

  return (
    <li>
      {item.children ? (
        <div>
          <button
            className={`w-full text-left px-4 py-2 font-semibold ${activeClass} flex items-center justify-between`}
            onClick={toggleDropdown}
          >
            <span>{item.label}</span>
            <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {isOpen && (
            <ul className="pl-4">
              {item.children.map((child: any) => (
                <SidebarItem key={child.route} item={child} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <Link href={item.route} className={`w-full block px-4 py-2 font-semibold ${activeClass}`}>
          {item.label}
        </Link>
      )}
    </li>
  );
};

export default SidebarItem;
