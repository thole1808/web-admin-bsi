
"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from 'react';
import GrafikPengunjung from "../Charts/GrafikPengunjung";
import TodayVisitors from '../TodayVisitor/TodayVisitors';
import StatsCard from '../StatsCard/StatsCard';
import TopBranchesTable from "../TopBranchesTable/TopBranchesTable";

import Image from 'next/image';
import QueueStatsOverview from "../QueueStatsOverview";
import BranchVisitor from "../BranchVisitor";


interface DropdownItem {
  id: number;
  name: string;
  avatar: string;
}

const Dashboard: React.FC = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
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
      <div className="min-h-screen bg-gray-100 p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3 space-y-6 py-5 w-full">
            <div className="flex space-x-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari disini"
                  className="w-full px-4 py-2 border rounded-xl pr-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="24px"
                  height="24px"
                  className="absolute right-3 top-3 text-gray-500"
                >
                  <path
                    d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
                  />
                </svg>
              </div>

              <button className="flex items-center bg-white space-x-2 px-4 py-2 border rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18l-7 8v6.5l-4 2v-8.5l-7-8z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="col-span-1 py-5 space-y-6">
            <div className="relative inline-block text-left w-full" ref={dropdownRef}>
              <button
                className="flex justify-between items-center bg-white px-6 py-1 w-full rounded-lg shadow-lg focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {/* User Avatar */}
                <div className="flex items-center">
                  <Image
                    src="/images/logo/48.png"
                    alt="User Avatar"
                    width={31}  // Specify your desired width
                    height={31} // Specify your desired height
                    priority // Optional: Add this if the image is critical for page load
                  />
                  {/* User Name */}
                  <span className="font-medium text-lg px-3">
                    {selectedItem?.name || 'Admin'} 
                  </span>
                </div>
                {/* Dropdown Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg py-2 z-10">
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

          <div className="col-span-1 md:col-span-3 space-y-6">
            <QueueStatsOverview />
            <GrafikPengunjung />
          </div>
          <div className="col-span-1">
            <BranchVisitor />
          </div>
          <div className="col-span-1 md:col-span-4 space-y-6">
            <div className="col-span-1 md:col-span-3">
              <div className="overflow-x-auto">
                <TopBranchesTable />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
