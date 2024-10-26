"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from 'react';
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

const TopBranchesTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Branch; direction: 'ascending' | 'descending' | null }>({
    key: 'branch',
    direction: 'ascending',
  });
  const [visibleColumns, setVisibleColumns] = useState({
    branch: true,
    percentage: true,
    served: true,
    notServed: true,
    waiting: true,
    inService: true,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columnLabels: { [key in keyof Branch]: string } = {
    branch: 'Nama Cabang',
    percentage: 'Prosentase Total Antrian',
    total: 'Total',
    served: 'Terlayani',
    notServed: 'Tidak Terlayani',
    waiting: 'Menunggu',
    inService: 'Dilayani',
  };

  const topBranches: Branch[] = [
    { branch: 'Pasar Senen', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Margonda', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Cempaka Mas', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
  ];

  const toggleColumnVisibility = (columnKey: keyof Branch) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
    setDropdownOpen(false); // Close dropdown after selecting an option
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      omit: !visibleColumns.branch,
    },
    {
      name: 'Prosentase Total Antrian',
      selector: 'percentage',
      cell: (row: Branch) => `${row.percentage} dari total ${row.total} antrian`,
      sortable: true,
      omit: !visibleColumns.percentage,
    },
    {
      name: 'Terlayani',
      selector: 'served',
      cell: (row: Branch) => <span className="bg-green-100 text-green-700 px-12 py-2 rounded-full">{row.served}</span>,
      center: true,
      omit: !visibleColumns.served,
    },
    {
      name: 'Tidak Terlayani',
      selector: 'notServed',
      cell: (row: Branch) => <span className="bg-red-100 text-red-700 px-12 py-2 rounded-full">{row.notServed}</span>,
      center: true,
      omit: !visibleColumns.notServed,
    },
    {
      name: 'Menunggu',
      selector: 'waiting',
      cell: (row: Branch) => <span className="bg-yellow-100 text-yellow-700 px-12 py-2 rounded-full">{row.waiting}</span>,
      center: true,
      omit: !visibleColumns.waiting,
    },
    {
      name: 'Dilayani',
      selector: 'inService',
      cell: (row: Branch) => <span className="bg-blue-100 text-blue-700 px-12 py-2 rounded-full">{row.inService}</span>,
      center: true,
      omit: !visibleColumns.inService,
    },
  ];

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
        {/* Filter Button */}
        {/* <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold">Filter</span>
        </button> */}
        <button className="flex bg-white items-center space-x-2 px-4 py-2 border rounded-lg" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
          {/* <span className="font-semibold"></span> */}
        </button>

        {dropdownOpen && (
          <div ref={dropdownRef} className="absolute z-10 bg-white border rounded-lg shadow-lg p-4 mt-2">
            {Object.keys(visibleColumns).map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visibleColumns[key as keyof Branch]}
                  onChange={() => toggleColumnVisibility(key as keyof Branch)}
                />
                <span>{columnLabels[key as keyof Branch]}</span>
              </label>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Cari antrian..."
          className="px-4 py-2 border rounded-lg w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        title="Cabang Teratas"
        columns={columns.filter(column => !column.omit)}
        data={sortedBranches}
        defaultSortFieldId="branch"
        pagination
        onSort={(column, direction) => {
          setSortConfig({ key: column.selector as keyof Branch, direction });
        }}
        sortServer={true}
      />
    </div>
  );
};

export default TopBranchesTable;
