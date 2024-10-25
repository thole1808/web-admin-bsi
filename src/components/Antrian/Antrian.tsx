"use client"; // Add this directive at the top

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

interface Branch {
  branch: string;
  percentage: string;
  total: number;
  served: number;
  notServed: number;
  waiting: number;
  inService: number;
}

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const SortingIcon = ({ direction }: { direction: string }) => (
  <svg width="16" height="16" viewBox="0 0 79 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_216_1473)">
      <rect width="79" height="68" rx="15" fill="white" />
      <path opacity="0.686151" d="M78.2303 70.4333V0" stroke="#979797" strokeWidth="0.3" strokeLinecap="square" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M39.8474 32.9527C45.8382 32.9527 50.6947 30.9255 50.6947 28.4248C50.6947 25.9242 45.8382 23.897 39.8474 23.897C33.8565 23.897 29 25.9242 29 28.4248C29 30.9255 33.8565 32.9527 39.8474 32.9527Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 28.4248C29.0028 32.9682 32.4557 36.9151 37.3441 37.9625V44.2723C37.3441 45.5226 38.4649 46.5362 39.8474 46.5362C41.2299 46.5362 42.3506 45.5226 42.3506 44.2723V37.9625C47.239 36.9151 50.6919 32.9682 50.6947 28.4248"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_216_1473">
        <rect width="79" height="68" rx="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const TopBranchesTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Branch; direction: 'ascending' | 'descending' | null }>({
    key: 'branch',
    direction: 'ascending',
  });
  const [selectedSortColumn, setSelectedSortColumn] = useState<keyof Branch>('branch');

  const topBranches: Branch[] = [
    { branch: 'Pasar Senen', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Margonda', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Cempaka Mas', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
  ];

  const columns = [
    {
      name: 'No',
      cell: (row: Branch, index: number) => index + 1,
      width: '50px',
      center: true,
    },
    {
      name: 'Nama Cabang',
      selector: 'branch',
      sortable: true,
    },
    {
      name: 'Prosentase Total Antrian',
      selector: 'percentage',
      cell: (row: Branch) => `${row.percentage} dari total ${row.total} antrian`,
      sortable: true,
    },
    {
      name: 'Terlayani',
      selector: 'served',
      cell: (row: Branch) => <span className="bg-green-100 text-green-700 px-12 py-2 rounded-full">{row.served}</span>,
      center: true,
    },
    {
      name: 'Tidak Terlayani',
      selector: 'notServed',
      cell: (row: Branch) => <span className="bg-red-100 text-red-700 px-12 py-2 rounded-full">{row.notServed}</span>,
      center: true,
    },
    {
      name: 'Menunggu',
      selector: 'waiting',
      cell: (row: Branch) => <span className="bg-yellow-100 text-yellow-700 px-12 py-2 rounded-full">{row.waiting}</span>,
      center: true,
    },
    {
      name: 'Dilayani',
      selector: 'inService',
      cell: (row: Branch) => <span className="bg-blue-100 text-blue-700 px-12 py-2 rounded-full">{row.inService}</span>,
      center: true,
    },
  ];

  const requestSort = (key: keyof Branch) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSortColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortColumn(e.target.value as keyof Branch);
    requestSort(e.target.value as keyof Branch);
  };

  const filteredBranches = useMemo(() => {
    return topBranches.filter((branch) => branch.branch.toLowerCase().includes(search.toLowerCase()));
  }, [search, topBranches]);

  const sortedBranches = useMemo(() => {
    let sortableItems = [...filteredBranches];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (typeof a[sortConfig.key] === 'string') {
          return a[sortConfig.key].localeCompare(b[sortConfig.key]) * (sortConfig.direction === 'ascending' ? 1 : -1);
        } else {
          return (a[sortConfig.key] - b[sortConfig.key]) * (sortConfig.direction === 'ascending' ? 1 : -1);
        }
      });
    }
    return sortableItems;
  }, [filteredBranches, sortConfig]);

  return (
    <div>
      <div className="flex items-center mb-4 mt-4 space-x-2">
        <input
          type="text"
          placeholder="Cari cabang..."
          className="px-4 py-2 border rounded-lg w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={sortedBranches}
          pagination
          highlightOnHover
          striped
          defaultSortField="branch"
          defaultSortAsc={true}
        />
      </div>
    </div>
  );
};

export default TopBranchesTable;
