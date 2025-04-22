"use client";
import React, { useState } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import useAutoLogout from '@/hooks/useAutoLogout';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ tambahkan ini
  useAutoLogout();

  return (
    <>
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col lg:ml-64">
          <Header
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />

          <main>
            <ToastContainer className="text-sm" />
            <div className="mx-auto max-w-screen-2xl md:px-6 md:py-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}