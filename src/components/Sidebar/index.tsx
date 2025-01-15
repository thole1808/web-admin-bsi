"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { signOut } from "next-auth/react";
import { FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: 'Main Menu',
    menuItems: [
      {
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'DashboardIcon',
      },
      {
        label: 'Queues',
        route: '/queues',
        icon: "QueuesIcon",
      },
      {
        label: 'Branches',
        route: '/branches',
        icon: "BranchesIcon",
      },
      {
        label: 'Master',
        route: '/master',
        icon: "DatabaseIcon",
        children: [
          { label: 'Approval Matrix', route: '/master/approval-matrix' },
          { label: 'Cabin Checks', route: '/master/cabin-checks' },
          { label: 'National Holiday', route: '/master/national-holiday' },
          { label: 'Service Types', route: '/master/service-types' },
          { label: 'Status Messages', route: '/master/status-messages' },
        ],
      },
      {
        label: 'Access',
        route: '/access',
        icon: "AccessIcon",
        children: [
          { label: 'Pengguna', route: '/access/users' },
          { label: 'Peran', route: '/access/roles' },
        ],
      },
      {
        label: 'Reports',
        route: '/reporting',
        icon: "ReportingIcon",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  const handleLogout = () => {
    signOut();
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`shadow fixed left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-4">
          <Link href="/">
            <Image
              src="/images/logo/logo-bsi.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="px-3 mt-3">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul>
                  {group.menuItems.map((item, idx) => (
                    <SidebarItem key={idx} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 flex justify-between items-center">
          <div>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-20 rounded-lg flex items-center justify-center space-x-2 border hover:bg-gray-50 border-gray-300 focus:outline-none text-sm"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
