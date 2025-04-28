"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Layouts/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: 'Menu Utama',
    menuItems: [
      { label: 'Beranda', route: '/dashboard', icon: 'DashboardIcon' },
      { label: 'Antrian', route: '/queues', icon: "QueuesIcon", permission: "view:queue" },
      { label: 'Cabang', route: '/branches', icon: "BranchesIcon", permission: "view:branch" },
      { label: 'Laporan', route: '/reports', icon: "ReportingIcon", permission: "view:report" },
      {
        label: 'Master Data',
        route: '/master',
        icon: "DatabaseIcon",
        children: [
          { label: 'Pemeriksaan Awak Kabin', route: '/master/cabin-crew-checks', permission: "view:cabin-crew-check" },
          { label: 'Hari Libur Nasional', route: '/master/national-holiday', permission: "view:national-holiday" },
          { label: 'Jenis Layanan', route: '/master/service-types', permission: "view:service-type" },
          { label: 'Pesan Status', route: '/master/status-messages', permission: "view:status-message" },
        ],
      },
      {
        label: 'Akses',
        route: '/access',
        icon: "AccessIcon",
        children: [
          { label: 'Pengguna', route: '/access/users', permission: "view:user" },
          { label: 'Peran', route: '/access/roles', permission: "view:role" },
        ],
      },
      {
        label: 'Audit Trail',
        route: '/audit',
        icon: "AuditIcon",
        permission: "view:audit-trail",
      },
      {
        label: 'Pengaturan',
        route: '/setting',
        icon: "AppsIcon",
        children: [
          { label: 'Banner', route: '/setting/banners', permission: "view:banner" },
          { label: 'Video', route: '/setting/videos', permission: "view:video" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const userPermissions = (session?.user as any)?.role.permissions || [];

  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;
    return userPermissions?.map((p: any) => p.name).includes(permission) ?? false;
  };

  if (status === 'loading') return null;

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`shadow fixed left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-4">
          <Link href="/" aria-label="Halaman Utama">
            <Image
              src="/images/logo/logo-bsi.png"
              alt="Logo BSI"
              width={160}
              height={160}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            type="button"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* MENU */}
          <nav className="px-3 mt-3" aria-label="Navigasi Sidebar">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul>
                  {group.menuItems.map((item, idx) => {
                    if (item.children) {
                      const permittedChildren = item.children.filter(child => hasPermission(child.permission));
                      if (permittedChildren.length === 0) return null;
                      return <SidebarItem key={idx} item={{ ...item, children: permittedChildren }} />;
                    } else {
                      if (!hasPermission(item.permission)) return null;
                      return <SidebarItem key={idx} item={item} />;
                    }
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* TOMBOL LOGOUT */}
        <div className="mt-auto p-4 flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-20 rounded-lg flex items-center justify-center space-x-2 border hover:bg-gray-50 border-gray-300 focus:outline-none"
            type="button"
          >
            <FiLogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;