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
              className={`flex items-center gap-x-2 cursor-pointer px-4 py-3 font-medium rounded-md duration-300 ${
                isActive
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "text-[#00BFB2] hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {child.icon && (
                <span
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-inherit"
                  } transition-colors duration-300`}
                >
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
