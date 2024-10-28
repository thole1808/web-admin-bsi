
"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from 'react';
import GrafikPengunjung from "../Charts/GrafikPengunjung";
import TodayVisitors from '../TodayVisitor/TodayVisitors';
import StatsCard from '../StatsCard/StatsCard';
import TopBranchesTable from "../TopBranchesTable/TopBranchesTable";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), { ssr: false });
import Image from 'next/image';


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
      <div className="min-h-screen bg-gray-100 p-5">
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
                  <span className="font-medium text-lg px-3 font-bold">
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
            {/* <div className="grid grid-cols-3 md:grid-cols-3 gap-6"> */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                icon={
                  <svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.21" fillRule="evenodd" clipRule="evenodd" d="M57 114C88.4802 114 114 88.4802 114 57C114 25.5198 88.4802 0 57 0C25.5197 0 0 25.5198 0 57C0 88.4802 25.5197 114 57 114Z" fill="#0047BB" />
                    <path opacity="0.587821" fillRule="evenodd" clipRule="evenodd" d="M36.5834 40.8491C36.5834 47.985 41.8067 53.7697 48.25 53.7697C54.6933 53.7697 59.9167 47.985 59.9167 40.8491C59.9167 33.7132 54.6933 27.9285 48.25 27.9285C41.8067 27.9285 36.5834 33.7132 36.5834 40.8491ZM65.7499 53.7697C65.7499 59.1216 69.6674 63.4602 74.4999 63.4602C79.3324 63.4602 83.2499 59.1216 83.2499 53.7697C83.2499 48.4178 79.3324 44.0793 74.4999 44.0793C69.6674 44.0793 65.7499 48.4178 65.7499 53.7697Z" fill="#8280FF" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M48.2013 60.23C34.4304 60.23 23.1323 68.068 22.0018 83.4846C21.9402 84.3243 23.3903 86.0712 24.1217 86.0712H72.3027C74.4938 86.0712 74.5278 84.1185 74.4938 83.4871C73.6391 67.6374 62.1659 60.23 48.2013 60.23ZM73.3367 66.6923C76.9974 72.0906 79.1666 78.8004 79.1666 86.0713H90.4133C91.9957 86.0713 92.0203 84.6067 91.9957 84.1332C91.3852 72.3758 83.2724 66.8125 73.3367 66.6923Z" fill="#8280FF" />
                  </svg>
                }
                title="Total Semua Pengunjung"
                value="287"
                change="8.5"
                positive={true}
              />

              <StatsCard
                icon={
                  <svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.21" fill-rule="evenodd" d="M57 114C88.4802 114 114 88.4802 114 57C114 25.5198 88.4802 0 57 0C25.5197 0 -3.05176e-05 25.5198 -3.05176e-05 57C-3.05176e-05 88.4802 25.5197 114 57 114Z" fill="#00BFB2" />
                    <path d="M44.0103 51.4504H35.9884C34.3406 51.4504 33 52.9846 33 54.8688V76.583C33 78.4669 34.3406 79.9999 35.9884 79.9999H44.0103C45.658 79.9999 46.9982 78.4669 46.9982 76.5831V54.8688C46.9984 52.9846 45.6581 51.4504 44.0103 51.4504Z" fill="#00A39D" />
                    <path d="M59.6483 34.0001C57.1208 34.0001 55.0646 36.0302 55.0646 38.5267C55.0646 38.6952 55.0748 38.8637 55.0941 39.0339C55.0638 39.1828 55.0605 39.3351 55.0933 39.4826C55.9684 43.4485 54.1444 47.9525 52.9784 50.283C52.8775 50.4837 52.7794 50.6791 52.6852 50.8565C52.5088 51.0581 52.2706 51.1943 52.0015 51.2436H51.6575C51.6079 51.2436 51.5295 51.2485 51.4693 51.2558C49.5562 51.3627 48.0777 52.8978 48.0777 54.7795V76.4647C48.0777 78.4137 49.6836 79.9998 51.6575 79.9998H76.4132C76.5224 79.9998 76.6273 79.9864 76.7266 79.9609C79.0453 79.7196 80.8259 77.7916 80.8259 75.4717C80.8259 74.2241 80.3117 73.0918 79.4775 72.2724C80.4102 71.4429 81 70.2406 81 68.9054C81 67.6137 80.4496 66.4476 79.5686 65.6214C80.4495 64.7967 81 63.629 81 62.3375C81 61.0459 80.4496 59.8798 79.5686 59.0551C80.4495 58.2288 81 57.0627 81 55.771C81 53.2746 78.9436 51.243 76.415 51.243L65.8263 51.2446C68.7872 42.1527 63.5298 36.0561 63.2886 35.7855C63.2837 35.7808 63.2788 35.7759 63.2739 35.7677C62.4075 34.6596 61.0623 34.0001 59.6483 34.0001Z" fill="#00A39D" />
                  </svg>
                }
                title="Total Yang dilayani"
                value="287"
                change="8.5"
                positive={true}
              />
              <StatsCard
                icon={
                  <svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.21" fill-rule="evenodd" clip-rule="evenodd" d="M57 114C88.4802 114 114 88.4802 114 57C114 25.5198 88.4802 0 57 0C25.5198 0 0 25.5198 0 57C0 88.4802 25.5198 114 57 114Z" fill="#F4A9A9" />
                    <path d="M44.0103 62.5497H35.9885C34.3406 62.5497 33 61.0155 33 59.1313V37.4171C33 35.5333 34.3406 34.0002 35.9885 34.0002H44.0103C45.658 34.0002 46.9983 35.5333 46.9983 37.417V59.1313C46.9984 61.0155 45.6582 62.5497 44.0103 62.5497Z" fill="#911515" />
                    <path d="M59.6484 79.9999C57.1209 79.9999 55.0647 77.9698 55.0647 75.4733C55.0647 75.3048 55.0749 75.1363 55.0942 74.9661C55.0638 74.8172 55.0606 74.6649 55.0933 74.5174C55.9685 70.5515 54.1444 66.0475 52.9785 63.717C52.8776 63.5163 52.7795 63.3209 52.6852 63.1435C52.5089 62.9419 52.2707 62.8057 52.0016 62.7564H51.6575C51.608 62.7564 51.5296 62.7515 51.4693 62.7442C49.5562 62.6373 48.0778 61.1022 48.0778 59.2205V37.5353C48.0778 35.5863 49.6837 34.0002 51.6575 34.0002H76.4133C76.5224 34.0002 76.6273 34.0136 76.7266 34.0391C79.0454 34.2804 80.826 36.2084 80.826 38.5283C80.826 39.7759 80.3117 40.9082 79.4776 41.7276C80.4102 42.5571 81 43.7594 81 45.0946C81 46.3863 80.4497 47.5524 79.5687 48.3786C80.4496 49.2033 81 50.371 81 51.6625C81 52.9541 80.4497 54.1202 79.5687 54.9449C80.4496 55.7712 81 56.9373 81 58.229C81 60.7254 78.9436 62.757 76.4151 62.757L65.8264 62.7554C68.7873 71.8473 63.5299 77.9439 63.2887 78.2145C63.2838 78.2192 63.2788 78.2241 63.2739 78.2323C62.4075 79.3404 61.0624 79.9999 59.6484 79.9999Z" fill="#911515" />
                  </svg>
                }
                title="Total tidak terlayani"
                value="20"
                change="8.5"
                positive={false}
              />
            </div>
            <GrafikPengunjung />
          </div>
          <div className="col-span-1">
            <TodayVisitors />
          </div>

          <div className="col-span-1 md:col-span-4 space-y-6">
            <div className="col-span-1 md:col-span-3">
              <TopBranchesTable />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
