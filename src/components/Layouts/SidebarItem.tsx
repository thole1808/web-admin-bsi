import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Layouts/SidebarDropdown";
import { FaHome, FaUsers, FaDatabase, FaCalendarCheck, FaChartBar, FaRegBuilding, FaUserShield, FaExclamationTriangle, FaBuilding, } from 'react-icons/fa';
import Link from 'next/link'
import { FaWrench } from "react-icons/fa6";

const IconMap: { [key: string]: JSX.Element } = {
  DashboardIcon: <FaHome className="w-4.5 h-4.5" />,
  RolesIcon: <FaUsers className="w-4.5 h-4.5" />,
  DatabaseIcon: <FaDatabase className="w-4.5 h-4.5" />,
  BranchesIcon: <FaBuilding className="w-4.5 h-4.5" />,
  QueuesIcon: <FaCalendarCheck className="w-4.5 h-4.5" />,
  CabangIcon: <FaRegBuilding className="w-4.5 h-4.5" />,
  ReportingIcon: <FaChartBar className="w-4.5 h-4.5" />,
  SettingsIcon: <FaWrench className="w-4.5 h-4.5" />,
  AccessIcon: <FaUserShield className="w-4.5 h-4.5" />,
  AuditIcon: <FaExclamationTriangle className="w-4.5 h-4.5" />,
};

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

  const isItemActive = isActive(item);

  React.useEffect(() => {
    if (isItemActive) {
      setIsOpen(true);
    }
  }, [isItemActive]);

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.children) {
      setIsOpen(!isOpen);
    } else if (item.route) {
      window.location.href = item.route;
    }
  };

  return (
    <li className="relative mb-1 text-sm">
      {/* Indikator Active */}
      <div
        className={`absolute left-1 top-2 bottom-2 w-1 transition-all duration-300 ease-in-out ${
          isItemActive ? "bg-teal-400 rounded-lg opacity-100" : "opacity-0"
        }`}
      />

      {/* Item utama */}
      <Link
        href={item.route || "#"}
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
      </Link>

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
