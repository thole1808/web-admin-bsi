import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <li className="relative">
      {/* Garis hover di sebelah kiri */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-[#00BFB2] transition-all duration-300 ease-in-out ${
          isItemActive ? "opacity-100" : "opacity-0"
        }`} style={{ color: "#00BFB2" }}
      />

      <Link
        href={item.route}
        onClick={handleClick}
        className={`${
          isItemActive ? "bg-transparan dark:bg-meta-4 with-border" : ""
        } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}  

        style={{ color: "#00BFB2" }} // Menambahkan warna teks hijau sesuai permintaan
      >
        {item.icon}
        {item.label}
        {item.children && (
          <svg
            // ... (svg code)
          />
        )}
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;