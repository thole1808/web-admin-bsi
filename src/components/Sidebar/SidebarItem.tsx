import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

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
    <li className="relative mb-2">
      {/* Indikator aktif */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
          isItemActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Item utama */}
      <div
        onClick={handleItemClick}
        className={`${
          isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
        } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out cursor-pointer hover:bg-graydark dark:hover:bg-meta-4`}
        style={{ color: "#00BFB2" }}
      >
        {item.icon}
        {item.label}
        {item.children && (
          <svg
            className={`ml-auto h-4 w-4 transform transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
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
