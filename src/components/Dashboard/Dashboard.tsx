
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
  );
};

export default Dashboard;
