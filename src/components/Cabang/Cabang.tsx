"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from 'next/image';



interface DropdownItem {
  id: number;
  name: string;
  avatar: string;
}

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
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const AntrianTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Antrian;
    direction: "ascending" | "descending" | null;
  }>({
    key: "namaNasabah",
    direction: "ascending",
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
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  // Sample dropdown data
  const dropdownData: DropdownItem[] = [
    { id: 1, name: 'User', avatar: 'https://example.com/avatar-user.jpg' },
    { id: 2, name: 'Guest', avatar: 'https://example.com/avatar-guest.jpg' },
    { id: 3, name: 'Moderator', avatar: 'https://example.com/avatar-moderator.jpg' },
  ];


  const columnLabels: { [key in keyof Antrian]: string } = {
    namaNasabah: "Nama Nasabah",
    jenisLayanan: "Jenis Layanan",
    noAntrian: "No. Antrian",
    waktuKedatangan: "Waktu Kedatangan",
    waktuTunggu: "Waktu Tunggu",
    sla: "SLA",
    statusLayanan: "Status Layanan",
    namaPetugas: "Nama Petugas",
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
      jenisLayanan: 'Buka Rekening',
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
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = [
    {
      name: "No",
      cell: (row: Antrian, index: number) => index + 1,
      width: "50px",
      center: true,
    },
    {
      name: "Nama Nasabah",
      selector: (row: Antrian) => row.namaNasabah,
      sortable: true,
      cell: (row: Antrian) => (
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>{row.namaNasabah}</span>
        </div>
      ),
      omit: !visibleColumns.namaNasabah,
    },
    {
      name: "Jenis Layanan",
      selector: (row: Antrian) => row.jenisLayanan,
      sortable: true,
      omit: !visibleColumns.jenisLayanan,
    },
    {
      name: "No. Antrian",
      selector: (row: Antrian) => row.noAntrian,
      sortable: true,
      omit: !visibleColumns.noAntrian,
    },
    {
      name: "Waktu Kedatangan",
      selector: (row: Antrian) => row.waktuKedatangan,
      sortable: true,
      omit: !visibleColumns.waktuKedatangan,
    },
    {
      name: "Waktu Tunggu",
      selector: (row: Antrian) => row.waktuTunggu,
      sortable: true,
      omit: !visibleColumns.waktuTunggu,
    },
    {
      name: "SLA",
      selector: (row: Antrian) => row.sla,
      sortable: true,
      omit: !visibleColumns.sla,
      cell: (row: Antrian) => (
        <span style={{ color: row.sla === "5 menit" ? "red" : "black" }}>
          {row.sla}
        </span>
      ),
    },
    {
      name: "Status Layanan",
      selector: (row: Antrian) => row.statusLayanan,
      sortable: true,
      omit: !visibleColumns.statusLayanan,
    },
    {
      name: "Nama Petugas",
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

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    setDropdownOpen(false);
  };

  return (
    <div>
      <div className="flex mb-10 justify-between items-center  py-5 w-full">
        {/* Search Input */}
        <div className="relative w-1/2">
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

        {/* User Dropdown */}
        <div className="relative inline-block text-left w-1/5" ref={dropdownRef}>
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

      <div className="flex justify-between mb-8 mt-10">
        <div className="flex items-center justify-between space-x-4 bg-white shadow-md rounded-lg p-2">
          {/* Filter Icon */}
          <div className="flex items-center space-x-2">
            <button
              className="bg-transparent rounded-md px-3 py-2 text--700"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
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

              {/* Garis pemisah */}

            </button>

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-gray-300"></div>
            <span className="text--700">Filter By</span>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Date Dropdown */}
          <div className="relative">
            <select className="bg-transparent rounded-md px-3 py-2 text--700">
              <option>Date</option>
              {/* Add more date options here */}
            </select>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Order Status Dropdown */}
          <div className="relative">
            <select className="bg-transparent rounded-md px-3 py-2 text--700">
              <option>Order Status</option>
              {/* Add more status options here */}
            </select>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Reset Filter Button */}
          <button className="flex items-center space-x-2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.75 8.75a5.25 5.25 0 1 1 9.66 3.25H21m-16.25 0v3.5h3.5"
              />
            </svg>
            <span>Reset Filter</span>
          </button>
        </div>
      </div>
          
      <DataTable
        columns={columns}
        data={filteredAntrianes}
        pagination
        responsive
      />
    </div>
  );
};

export default AntrianTable;
