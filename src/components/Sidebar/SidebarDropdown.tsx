// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const SidebarDropdown = ({ item }: any) => {
//   const pathname = usePathname();

//   return (
//     <>
//       <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
//         {item.map((item: any, index: number) => (
//           <li key={index}>
//             <Link
//               href={item.route}
//               className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
//                 pathname === item.route ? "text-white" : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default SidebarDropdown;


// SidebarDropdown.tsx
// import React from "react";
// import Link from "next/link";

// const SidebarDropdown = ({ items }: any) => {
//   return (
//     <ul className="space-y-2">
//       {items.map((subItem: any, idx: number) => (
//         <li key={idx}>
//           <Link
//             href={subItem.route}
//             className="block px-6 py-2 text-sm text-bodydark1 duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-meta-4"
//           >
//             {subItem.label}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;


// // SidebarDropdown.tsx
// import React from "react";
// import Link from "next/link";

// const SidebarDropdown = ({ items }: any) => {
//   return (
//     <ul className="space-y-2">
//       {items.map((subItem: any, idx: number) => (
//         <li key={idx}>
//           <a
//             href={subItem.route || "#"}  // Sub-menu item tidak akan redirect jika tidak ada route
//             className="block px-6 py-2 text-sm text-bodydark1 duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-meta-4"
//           >
//             {subItem.label}
//           </a>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;


// SidebarDropdown.tsx
// import React from "react";

// const SidebarDropdown = ({ items, onSubItemClick }: any) => {
//   return (
//     <ul className="space-y-2">
//       {items.map((subItem: any, idx: number) => (
//         <li key={idx}>
//           <a
//             href={subItem.route || "#"} // Sub-menu item tidak akan redirect jika tidak ada route
//             className="block px-6 py-2 text-sm text-bodydark1 duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-meta-4"
//             onClick={onSubItemClick} // Klik di dalam sub-menu tidak akan menutup sub-menu
//           >
//             {subItem.label}
//           </a>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;


// import React from "react";
// import { usePathname } from "next/navigation";

// const SidebarDropdown = ({ items }: any) => {
//   const pathname = usePathname();

//   // Fungsi untuk mengecek apakah sub-item aktif
//   const isActive = (route: string) => route === pathname;

//   return (
//     <ul className="space-y-2">
//       {items.map((subItem: any, idx: number) => (
//         <li key={idx}>
//           <a
//             href={subItem.route || "#"}
//             className={`block px-6 py-2 text-sm duration-300 ease-in-out ${
//               isActive(subItem.route)
//                 ? "text-[#00BFB2] font-bold"
//                 : "text-bodydark1 hover:bg-gray-200 dark:hover:bg-meta-4"
//             }`}
//             onClick={(e) => {
//               if (!subItem.route) e.preventDefault(); // Hindari redirect jika tidak ada route
//             }}
//           >
//             {subItem.label}
//           </a>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;


// import React from "react";

// const SidebarDropdown = ({ item }: any) => {
//   return (
//     <ul className="flex flex-col gap-2">
//       {item.map((child: any, index: number) => (
//         <li key={index}>
//           <div
//             onClick={(e) => {
//               e.stopPropagation(); // Mencegah penutupan sub-menu
//               if (child.route) {
//                 window.location.href = child.route;
//               }
//             }}
//             className="cursor-pointer px-4 py-2 text-bodydark1 hover:bg-graydark rounded-md duration-300"
//             style={{ color: "#00BFB2" }}
//           >
//             {child.label}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarDropdown;


import React from "react";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-2">
      {item.map((child: any, index: number) => {
        const isActive = child.route === pathname; // Cek apakah rute sesuai dengan rute aktif

        return (
          <li key={index}>
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah penutupan sub-menu
                  if (child.route) {
                    window.location.href = child.route;
                  }
                }}
                className={`flex items-center gap-x-2 cursor-pointer px-10 py-2 rounded-md duration-300 ${
                  isActive
                    ? "text-black hover:bg-[#009A8B]"
                    : "text-[#00BFB2] hover:bg-graydark"
                }`}
              >
                {child.icon && (
                  <span className="w-5 h-5 text-inherit">
                    {child.icon}
                  </span>
                )}
                <span className="flex-1">{child.label}</span>
              </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarDropdown;

