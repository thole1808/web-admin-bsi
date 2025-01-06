"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import React, { useState, ReactNode, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  interface DropdownItem {
    id: number;
    name: string;
    avatar: string;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample dropdown data
  const dropdownData: DropdownItem[] = [
    { id: 1, name: 'User', avatar: 'https://example.com/avatar-user.jpg' },
    { id: 2, name: 'Guest', avatar: 'https://example.com/avatar-guest.jpg' },
    { id: 3, name: 'Moderator', avatar: 'https://example.com/avatar-moderator.jpg' },
  ];
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    setDropdownOpen(false);
  };
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col lg:ml-64">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="w-full bg-white grid grid-cols-5">
              <div className="col-span-2 ml-4 flex items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Cari disini.."
                    className="w-full px-4 py-1 border rounded-md pr-10 text-sm focus:outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width="16px"
                    height="16px"
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    <path
                      d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="col-span-2"></div>
              <div className="relative inline-block text-left w-full border-l" ref={dropdownRef}>
                <button
                  className="flex justify-between items-center px-6 py-1 w-full rounded-lg focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center">
                    <Image
                      src="/images/logo/48.png"
                      alt="User Avatar"
                      width={24}
                      height={24}
                      priority
                    />
                    <span className="font-medium text-sm p-3">
                      {selectedItem?.name || 'Admin'}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow py-2 z-10">
                    {dropdownData.map((item) => (
                      <a
                        key={item.id}
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleItemClick(item)} // Pass the item to the handler
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>


            <div className="mx-auto max-w-screen-2xl md:px-6 md:py-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
