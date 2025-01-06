import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { FaHome, FaUsers, FaDatabase, FaCalendarAlt, FaChartBar, FaRegBuilding } from 'react-icons/fa';

const IconMap: { [key: string]: JSX.Element } = {
  DashboardIcon: <FaHome className="w-4 h-4s" />,
  RolesIcon: <FaUsers className="w-4 h-4s" />,
  DatabaseIcon: <FaDatabase className="w-4 h-4s" />,
  BranchIcon: <FaRegBuilding className="w-4 h-4s" />,
  AntrianIcon: <FaCalendarAlt className="w-4 h-4s" />,
  CabangIcon: <FaRegBuilding className="w-4 h-4s" />,
  ReportingIcon: <FaChartBar className="w-4 h-4s" />,
};

const SidebarItem = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState(false); // Status apakah sub-menu terbuka
  const pathname = usePathname();

  // Fungsi untuk mengecek apakah item aktif
  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  // Pastikan sub-menu terbuka jika ada sub-item aktif
  React.useEffect(() => {
    if (isItemActive) {
      setIsOpen(true);
    }
  }, [isItemActive]);

  // Fungsi untuk menangani klik pada item utama
  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.children) {
      setIsOpen(!isOpen); // Toggle sub-menu
    } else if (item.route) {
      window.location.href = item.route; // Redirect ke halaman
    }
  };

  return (
    <li className="relative mb-1 text-sm">
      {/* Indikator aktif */}
      <div
        className={`absolute left-1 top-2 bottom-2 w-1 transition-all duration-300 ease-in-out ${
          isItemActive ? "bg-teal-400 rounded-lg opacity-100" : "opacity-0"
        }`}
      />

      {/* Item utama */}
      <div
        onClick={handleItemClick}
        className={`${
          isItemActive
            ? "bg-teal-400 text-white dark:bg-meta-4"
            : "text-teal-600 hover:bg-teal-100 dark:hover:bg-meta-4"
        } flex gap-3 items-center px-4 py-3 font-medium duration-300 ease-in-out cursor-pointer rounded-lg`}
      >
        <span
          className={`${
            isItemActive ? "text-white" : "text-teal-600"
          } transition-colors duration-300`}
        >
          {/* Render ikon berdasarkan nama */}
          {item.icon && IconMap[item.icon]}
        </span>
        <span>{item.label}</span>
        {item.children && (
          <svg
            className={`ml-auto h-4 w-4 transform transition-transform ${
              isOpen ? "rotate-90" : ""
            } ${isItemActive ? "text-white" : "text-gray-600"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Sub-menu */}
      {item.children && isOpen && (
        <div className="mt-2 pl-4">
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
