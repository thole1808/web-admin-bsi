"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Define the Cabang interface
interface Cabang {
    nama_cabang: string;
    antrian: string;
    pengunjung: string;
    loket: string;
    status: string;
}

// Load the DataTable component dynamically
const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const CabangTable: React.FC = () => {
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Cabang; direction: 'ascending' | 'descending' | null }>({
        key: 'nama_cabang',
        direction: 'ascending',
    });

    const [visibleColumns, setVisibleColumns] = useState({
        nama_cabang: true,
        antrian: true,
        pengunjung: true,
        loket: true,
        status: true,
        action: true,
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [actionDropdownOpen, setActionDropdownOpen] = useState<number | null>(null); // State to manage dropdown for actions
    const dropdownRef = useRef<HTMLDivElement>(null);

    const columnLabels: { [key in keyof Cabang | 'action']: string } = {
        nama_cabang: 'Nama Cabang',
        antrian: 'Antrian',
        pengunjung: 'Pengunjung',
        loket: 'Loket',
        status: 'Status',
        action: 'Aksi',
    };

    const topCabangs = useMemo<Cabang[]>(() => [
        { nama_cabang: 'Pasar Senen', antrian: 'A001', pengunjung: '1', loket: '1', status: 'Selesai' },
        { nama_cabang: 'Margonda', antrian: 'B002', pengunjung: '1', loket: '2', status: 'Selesai' },
        { nama_cabang: 'Cempaka Mas', antrian: 'C003', pengunjung: '1', loket: '3', status: 'Selesai' },
    ], []);

    const toggleColumnVisibility = (columnKey: keyof Cabang | 'action') => {
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
                setActionDropdownOpen(null); // Close action dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleActionDropdownToggle = (index: number) => {
        setActionDropdownOpen(actionDropdownOpen === index ? null : index);
    };

    const handleActionClick = (action: string, index: number) => {
        console.log(action, index);
        setActionDropdownOpen(null); // Close the action dropdown
    };

    const columns = [
        {
            name: 'No',
            cell: (_: Cabang, index: number) => index + 1,
            width: '50px',
            center: true,
        },
        {
            name: <div className="text-center">Nama Cabang</div>,
            selector: (row: Cabang) => row.nama_cabang,
            sortable: true,
            omit: !visibleColumns.nama_cabang,
            cell: (row: Cabang) => (
                <div className="text-center">{row.nama_cabang}</div>
            ),
        },
        {
            name: <div className="text-center">Antrian</div>,
            selector: (row: Cabang) => row.antrian,
            sortable: true,
            omit: !visibleColumns.antrian,
            cell: (row: Cabang) => (
                <div className="text-center">{row.antrian}</div>
            ),
        },
        {
            name: <div className="text-center">Pengunjung</div>,
            selector: (row: Cabang) => row.pengunjung,
            sortable: true,
            omit: !visibleColumns.pengunjung,
            cell: (row: Cabang) => (
                <div className="text-center">{row.pengunjung}</div>
            ),
        },
        {
            name: <div className="text-center">Loket</div>,
            selector: (row: Cabang) => row.loket,
            sortable: true,
            omit: !visibleColumns.loket,
            cell: (row: Cabang) => (
                <div className="text-center">{row.loket}</div>
            ),
        },
        {
            name: <div className="text-center">Status</div>,
            selector: (row: Cabang) => row.status,
            sortable: true,
            omit: !visibleColumns.status,
            cell: (row: Cabang) => (
                <div className="text-center">
                    <span
                        className={`px-5 py-2 rounded-full text-[#007C80] ${row.status === 'Selesai' ? 'bg-[#B3ECE8]' : 'bg-yellow-500'
                            }`}
                    >
                        {row.status}
                    </span>
                </div>
            ),
        },
        {
            name: '',
            cell: (_: Cabang, index: number) => (
                <div className="relative flex justify-center items-center">
                    <span
                        className="px-3 py-2 text-[#3C3C3C] text-2xl cursor-pointer hover:bg-gray-200 hover:shadow-lg rounded-full transition duration-200 ease-in-out"
                        onClick={() => handleActionDropdownToggle(index)}
                    >
                        ...
                    </span>
                    {actionDropdownOpen === index && (
                        <div className="absolute right-0 z-10 bg-white border shadow-lg rounded-md p-2 min-w-[150px]">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                onClick={() => handleActionClick('Edit', index)}
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">✏️</span>
                                    Edit
                                </span>
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                onClick={() => handleActionClick('Delete', index)}
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">🗑️</span>
                                    Delete
                                </span>
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                onClick={() => handleActionClick('View', index)}
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">👁️</span>
                                    View
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            ),
            omit: !visibleColumns.action,
        },
    ];

    const filteredCabangs = useMemo(() => {
        return topCabangs.filter((cabang) => {
            const lowerCaseSearch = search.toLowerCase();
            return (
                cabang.nama_cabang.toLowerCase().includes(lowerCaseSearch) ||
                cabang.antrian.toLowerCase().includes(lowerCaseSearch) ||
                cabang.pengunjung.toLowerCase().includes(lowerCaseSearch) ||
                cabang.loket.toLowerCase().includes(lowerCaseSearch) ||
                cabang.status.toLowerCase().includes(lowerCaseSearch)
            );
        });
    }, [search, topCabangs]);

    const sortedCabangs = useMemo(() => {
        let sortableItems = [...filteredCabangs];
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
    }, [filteredCabangs, sortConfig]);

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
                                checked={visibleColumns[key as keyof Cabang | 'action']}
                                onChange={() => toggleColumnVisibility(key as keyof Cabang | 'action')}
                                className="mr-2"
                            />
                            <label>{label}</label>
                        </div>
                    ))}
                </div>
            )}
            <DataTable
                columns={columns}
                data={sortedCabangs}
                pagination
            />
        </div>
    );
};

export default CabangTable;
