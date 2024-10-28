"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Define the Antrian interface
interface Antrian {
  nik: string;
  nama: string;
  email: string;
  peran: string;
}

// Load the DataTable component dynamically
const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const AntrianTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Antrian; direction: 'ascending' | 'descending' | null }>({
    key: 'nik', 
    direction: 'ascending',
  });

  const [visibleColumns, setVisibleColumns] = useState({
    nik: true,
    nama: true,
    email: true,
    peran: true,
    action: true, // Added action visibility
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columnLabels: { [key in keyof Antrian | 'action']: string } = {
    nik: 'NIK',
    nama: 'Nama',
    email: 'Email',
    peran: 'Peran',
    action: 'Aksi', // New action label
  };

  const topAntrianes: Antrian[] = useMemo(() => [
    { nik: '123456789', nama: 'Andi', email: 'andi@example.com', peran: 'Admin' },
    { nik: '987654321', nama: 'Budi', email: 'budi@example.com', peran: 'User' },
    { nik: '456789123', nama: 'Citra', email: 'citra@example.com', peran: 'User' },
    { nik: '654321789', nama: 'Dewi', email: 'dewi@example.com', peran: 'Admin' },
    { nik: '321456987', nama: 'Eko', email: 'eko@example.com', peran: 'User' },
    { nik: '789321456', nama: 'Fika', email: 'fika@example.com', peran: 'User' },
    { nik: '147258369', nama: 'Gita', email: 'gita@example.com', peran: 'Admin' },
    { nik: '258369147', nama: 'Hadi', email: 'hadi@example.com', peran: 'User' },
    { nik: '369147258', nama: 'Indah', email: 'indah@example.com', peran: 'User' },
    { nik: '159753486', nama: 'Joko', email: 'joko@example.com', peran: 'User' },
  ], []);

  const toggleColumnVisibility = (columnKey: keyof Antrian | 'action') => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
    setDropdownOpen(false);
  };

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

  const columns = [
    {
      name: 'No',
      cell: (row: Antrian, index: number) => index + 1,
      width: '50px',
      center: true,
    },
    {
      name: 'NIK',
      selector: (row: Antrian) => row.nik, // Use row.nik for selector
      sortable: true,
      omit: !visibleColumns.nik,
    },
    {
      name: 'Nama',
      selector: (row: Antrian) => row.nama, // Use row.nama for selector
      sortable: true,
      omit: !visibleColumns.nama,
    },
    {
      name: 'Email',
      selector: (row: Antrian) => row.email, // Use row.email for selector
      sortable: true,
      omit: !visibleColumns.email,
    },
    {
      name: 'Peran',
      selector: (row: Antrian) => row.peran, // Use row.peran for selector
      sortable: true,
      omit: !visibleColumns.peran,
    },
    {
      name: 'Aksi',
      cell: (row: Antrian) => (
        <div className="flex space-x-2">
          <button className="bg-orange-500 text-white px-3 py-1 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 4h2a2 2 0 012 2v2m-2-2l-8 8H6v2a2 2 0 002 2h2a2 2 0 002-2v-2l8-8z"
              />
            </svg>
            Edit
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 15v4a2 2 0 002 2h4m10-14a2 2 0 00-2-2h-1.5a2 2 0 00-1.5.5l-1.25 1.25M16 4l4 4m-4 0l4-4M6 18h15"
              />
            </svg>
            Delete
          </button>
        </div>
      ),
      omit: !visibleColumns.action,
    },
  ];

  const filteredAntrianes = useMemo(() => {
    return topAntrianes.filter((antrian) =>
      antrian.nik.toLowerCase().includes(search.toLowerCase()) ||
      antrian.nama.toLowerCase().includes(search.toLowerCase()) ||
      antrian.email.toLowerCase().includes(search.toLowerCase()) ||
      antrian.peran.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, topAntrianes]);

  const sortedAntrianes = useMemo(() => {
    let sortableItems = [...filteredAntrianes];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * (sortConfig.direction === 'ascending' ? 1 : -1);
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredAntrianes, sortConfig]);

  return (
    <div>
      <div className="flex items-center mb-4 mt-4 space-x-2">
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
        </button>
        <input
          type="text"
          placeholder="Cari disini..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 border rounded-lg"
        />
      </div>
      {dropdownOpen && (
        <div ref={dropdownRef} className="border rounded-lg p-4 mb-4 bg-white shadow-lg absolute z-10">
          {Object.entries(columnLabels).map(([key, label]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={visibleColumns[key as keyof Antrian | 'action']}
                onChange={() => toggleColumnVisibility(key as keyof Antrian | 'action')}
                className="mr-2"
              />
              <label>{label}</label>
            </div>
          ))}
        </div>
      )}
      <DataTable
        columns={columns}
        data={sortedAntrianes}
        pagination
      />
    </div>
  );
};

export default AntrianTable;
