"use client"; // Add this directive at the top

import React from 'react';
// import DataTable from 'react-data-table-component';
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
  const topBranches: Branch[] = [
    { branch: 'Pasar Senen', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Margonda', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Cempaka Mas', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
  ];

  const columns = [
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
      cell: (row: Branch) => (
        <span className="bg-green-100 text-green-700 px-12 py-2 rounded-full">{row.served}</span>
      ),
      center: true,
    },
    {
      name: 'Tidak Terlayani',
      selector: 'notServed',
      cell: (row: Branch) => (
        <span className="bg-red-100 text-red-700 px-12 py-2 rounded-full">{row.notServed}</span>
      ),
      center: true,
    },
    {
      name: 'Menunggu',
      selector: 'waiting',
      cell: (row: Branch) => (
        <span className="bg-yellow-100 text-yellow-700 px-12 py-2 rounded-full">{row.waiting}</span>
      ),
      center: true,
    },
    {
      name: 'Dilayani',
      selector: 'inService',
      cell: (row: Branch) => (
        <span className="bg-blue-100 text-blue-700 px-12 py-2 rounded-full">{row.inService}</span>
      ),
      center: true,
    },
  ];

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4">5 Cabang Terbaik</h3>
      <DataTable
        columns={columns}
        data={topBranches}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default TopBranchesTable;
