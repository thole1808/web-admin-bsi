"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Define the Antrian interface
interface Antrian {
  namaNasabah: string;
  jenisLayanan: string;
  noAntrian: string;
  waktuKedatangan: string;
  waktuTunggu: string;
  sla: string;
  statusLayanan: string;
  namaPetugas: string;
}

// Load the DataTable component dynamically
const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const AntrianTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Antrian; direction: 'ascending' | 'descending' | null }>({
    key: 'namaNasabah',
    direction: 'ascending',
  });

  const [visibleColumns, setVisibleColumns] = useState({
    namaNasabah: true,
    jenisLayanan: true,
    noAntrian: true,
    waktuKedatangan: true,
    waktuTunggu: true,
    sla: true,
    statusLayanan: true,
    namaPetugas: true,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update column labels (removed action)
  const columnLabels: { [key in keyof Antrian]: string } = {
    namaNasabah: 'Nama Nasabah',
    jenisLayanan: 'Jenis Layanan',
    noAntrian: 'No. Antrian',
    waktuKedatangan: 'Waktu Kedatangan',
    waktuTunggu: 'Waktu Tunggu',
    sla: 'SLA',
    statusLayanan: 'Status Layanan',
    namaPetugas: 'Nama Petugas',
  };

  const topAntrianes: Antrian[] = useMemo(() => [
    {
      namaNasabah: 'Andi',
      jenisLayanan: 'Setor Tunai',
      noAntrian: '001',
      waktuKedatangan: '25 Okt 2024 | 10:20',
      waktuTunggu: '10 menit',
      sla: '10 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Rudi Hartono',
    },
    {
      namaNasabah: 'Budi',
      jenisLayanan: 'Tarik Tunai',
      noAntrian: '002',
      waktuKedatangan: '25 Okt 2024 | 10:25',
      waktuTunggu: '5 menit',
      sla: '5 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Siti Aisyah',
    },
    {
      namaNasabah: 'Cindy',
      jenisLayanan: 'Pembukaan Rekening',
      noAntrian: '003',
      waktuKedatangan: '25 Okt 2024 | 10:30',
      waktuTunggu: '8 menit',
      sla: '8 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Joko Susilo',
    },
    {
      namaNasabah: 'Diana',
      jenisLayanan: 'Konsultasi',
      noAntrian: '004',
      waktuKedatangan: '25 Okt 2024 | 10:35',
      waktuTunggu: '3 menit',
      sla: '3 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Wati Rahmawati',
    },
    {
      namaNasabah: 'Eko',
      jenisLayanan: 'Transfer',
      noAntrian: '005',
      waktuKedatangan: '25 Okt 2024 | 10:40',
      waktuTunggu: '15 menit',
      sla: '15 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Agus Setiawan',
    },
    {
      namaNasabah: 'Fina',
      jenisLayanan: 'Kredit',
      noAntrian: '006',
      waktuKedatangan: '25 Okt 2024 | 10:45',
      waktuTunggu: '20 menit',
      sla: '20 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Tina Lestari',
    },
    {
      namaNasabah: 'Guntur',
      jenisLayanan: 'Deposit',
      noAntrian: '007',
      waktuKedatangan: '25 Okt 2024 | 10:50',
      waktuTunggu: '12 menit',
      sla: '12 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Rina Pratiwi',
    },
    {
      namaNasabah: 'Hana',
      jenisLayanan: 'Ganti Kartu',
      noAntrian: '008',
      waktuKedatangan: '25 Okt 2024 | 10:55',
      waktuTunggu: '7 menit',
      sla: '7 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Budi Santoso',
    },
    {
      namaNasabah: 'Iwan',
      jenisLayanan: 'Pencairan Deposito',
      noAntrian: '009',
      waktuKedatangan: '25 Okt 2024 | 11:00',
      waktuTunggu: '6 menit',
      sla: '6 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Lina Marlina',
    },
    {
      namaNasabah: 'Joko',
      jenisLayanan: 'Pinjaman',
      noAntrian: '010',
      waktuKedatangan: '25 Okt 2024 | 11:05',
      waktuTunggu: '4 menit',
      sla: '4 menit',
      statusLayanan: 'Sedang Dilayani',
      namaPetugas: 'Sandy Prabowo',
    },
  ], []);

  const toggleColumnVisibility = (columnKey: keyof Antrian) => {
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
      name: 'Nama Nasabah',
      selector: (row: Antrian) => row.namaNasabah,
      sortable: true,
      omit: !visibleColumns.namaNasabah,
    },
    {
      name: 'Jenis Layanan',
      selector: (row: Antrian) => row.jenisLayanan,
      sortable: true,
      omit: !visibleColumns.jenisLayanan,
    },
    {
      name: 'No. Antrian',
      selector: (row: Antrian) => row.noAntrian,
      sortable: true,
      omit: !visibleColumns.noAntrian,
    },
    {
      name: 'Waktu Kedatangan',
      selector: (row: Antrian) => row.waktuKedatangan,
      sortable: true,
      omit: !visibleColumns.waktuKedatangan,
    },
    {
      name: 'Waktu Tunggu',
      selector: (row: Antrian) => row.waktuTunggu,
      sortable: true,
      omit: !visibleColumns.waktuTunggu,
    },
    {
      name: 'SLA',
      selector: (row: Antrian) => row.sla,
      sortable: true,
      omit: !visibleColumns.sla,
      cell: (row: Antrian) => (
        <span style={{ color: row.sla === '5 menit' ? 'red' : 'black' }}>
          {row.sla}
        </span>
      ),
    },
    {
      name: 'Status Layanan',
      selector: (row: Antrian) => row.statusLayanan,
      sortable: true,
      omit: !visibleColumns.statusLayanan,
    },
    {
      name: 'Nama Petugas',
      selector: (row: Antrian) => row.namaPetugas,
      sortable: true,
      omit: !visibleColumns.namaPetugas,
    },
  ];

  const filteredAntrianes = useMemo(() => {
    return topAntrianes.filter((antrian) =>
      antrian.namaNasabah.toLowerCase().includes(search.toLowerCase()) ||
      antrian.jenisLayanan.toLowerCase().includes(search.toLowerCase()) ||
      antrian.noAntrian.toLowerCase().includes(search.toLowerCase()) ||
      antrian.waktuKedatangan.toLowerCase().includes(search.toLowerCase()) ||
      antrian.waktuTunggu.toLowerCase().includes(search.toLowerCase()) ||
      antrian.sla.toLowerCase().includes(search.toLowerCase()) ||
      antrian.statusLayanan.toLowerCase().includes(search.toLowerCase()) ||
      antrian.namaPetugas.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex items-center mb-4 mt-30 space-x-2">
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
      {/* <input
        type="text"
        placeholder="Cari..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full"
      /> */}
      <DataTable
        columns={columns}
        data={sortedAntrianes}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        sortServer
      />
    </div>
  );
};

export default AntrianTable;
