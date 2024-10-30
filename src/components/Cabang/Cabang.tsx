"use client"; // Add this directive at the top

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Line } from 'react-chartjs-2';
import Image from 'next/image';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

interface DropdownItem {
    id: number;
    name: string;
    avatar: string;
}

interface Cabang {
    namaCabang: string;
    alamat: string;
    totalPengunjung: string;
    terlayani: string;
    tidakTerlayani: string;
    graphic: any;  // JSX for chart + percentage
    option: string;
}

// Load the DataTable component dynamically
const DataTable = dynamic(() => import("react-data-table-component"), {
    ssr: false,
});

// Register the required components for chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CabangTable: React.FC = () => {
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Sample dropdown data
    const dropdownData: DropdownItem[] = [
        { id: 1, name: 'User', avatar: 'https://example.com/avatar-user.jpg' },
        { id: 2, name: 'Guest', avatar: 'https://example.com/avatar-guest.jpg' },
        { id: 3, name: 'Moderator', avatar: 'https://example.com/avatar-moderator.jpg' },
    ];

    const [visibleColumns, setVisibleColumns] = useState({
        namaCabang: true,
        alamat: true,
        totalPengunjung: true,
        terlayani: true,
        tidakTerlayani: true,
        graphic: true,
        option: true,
    });

    // Function to determine the color of the line graph
    const getLineColor = (data: number[]) => {
        return data[data.length - 1] >= data[0] ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'; // Green if rising, Red if falling
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,  // Hide legend
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
        },
        scales: {
            x: {
                display: false,  // Hide x-axis
            },
            y: {
                display: false,  // Hide y-axis
            },
        },
    };

    const dataCabang: Cabang[] = useMemo(() => [
        {
            namaCabang: 'Rawa Mangun',
            alamat: 'Jl. Pemuda No.152',
            totalPengunjung: '214',
            terlayani: '212',
            tidakTerlayani: '02',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [65, 59, 80, 81, 56, 55],
                                        borderColor: getLineColor([65, 59, 80, 81, 56, 55]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([65, 59, 80, 81, 56, 55]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([65, 59, 80, 81, 56, 55]) === 'rgba(75, 192, 192, 1)' ? "+0.00%" : "-0.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Grogol',
            alamat: 'Jl. Letjen S. Parman No.10',
            totalPengunjung: '120',
            terlayani: '118',
            tidakTerlayani: '02',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [40, 55, 45, 50, 52, 60],
                                        borderColor: getLineColor([40, 55, 45, 50, 52, 60]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([40, 55, 45, 50, 52, 60]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([40, 55, 45, 50, 52, 60]) === 'rgba(75, 192, 192, 1)' ? "+5.00%" : "-5.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Cibubur',
            alamat: 'Jl. Raya Bogor No.1',
            totalPengunjung: '300',
            terlayani: '290',
            tidakTerlayani: '10',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [100, 120, 115, 110, 130, 140],
                                        borderColor: getLineColor([100, 120, 115, 110, 130, 140]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([100, 120, 115, 110, 130, 140]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([100, 120, 115, 110, 130, 140]) === 'rgba(75, 192, 192, 1)' ? "+10.00%" : "-10.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Bintaro',
            alamat: 'Jl. Bintaro Utama No.5',
            totalPengunjung: '400',
            terlayani: '395',
            tidakTerlayani: '05',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [300, 290, 285, 295, 310, 320],
                                        borderColor: getLineColor([300, 290, 285, 295, 310, 320]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([300, 290, 285, 295, 310, 320]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([300, 290, 285, 295, 310, 320]) === 'rgba(75, 192, 192, 1)' ? "+7.00%" : "-7.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Depok',
            alamat: 'Jl. Margonda Raya No.88',
            totalPengunjung: '500',
            terlayani: '490',
            tidakTerlayani: '10',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [410, 420, 430, 440, 450, 460],
                                        borderColor: getLineColor([410, 420, 430, 440, 450, 460]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([410, 420, 430, 440, 450, 460]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([410, 420, 430, 440, 450, 460]) === 'rgba(75, 192, 192, 1)' ? "+5.00%" : "-5.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Tangerang',
            alamat: 'Jl. Raya Serpong No.8',
            totalPengunjung: '350',
            terlayani: '340',
            tidakTerlayani: '10',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [200, 210, 220, 230, 240, 250],
                                        borderColor: getLineColor([200, 210, 220, 230, 240, 250]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([200, 210, 220, 230, 240, 250]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([200, 210, 220, 230, 240, 250]) === 'rgba(75, 192, 192, 1)' ? "+5.00%" : "-5.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Cikarang',
            alamat: 'Jl. Raya Cikarang No.15',
            totalPengunjung: '250',
            terlayani: '245',
            tidakTerlayani: '05',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [120, 130, 125, 135, 140, 145],
                                        borderColor: getLineColor([120, 130, 125, 135, 140, 145]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([120, 130, 125, 135, 140, 145]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([120, 130, 125, 135, 140, 145]) === 'rgba(75, 192, 192, 1)' ? "+3.00%" : "-3.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Jakarta Pusat',
            alamat: 'Jl. Kebon Sirih No.99',
            totalPengunjung: '600',
            terlayani: '590',
            tidakTerlayani: '10',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [500, 510, 520, 530, 540, 550],
                                        borderColor: getLineColor([500, 510, 520, 530, 540, 550]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([500, 510, 520, 530, 540, 550]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([500, 510, 520, 530, 540, 550]) === 'rgba(75, 192, 192, 1)' ? "+4.00%" : "-4.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Bekasi',
            alamat: 'Jl. Ahmad Yani No.20',
            totalPengunjung: '450',
            terlayani: '440',
            tidakTerlayani: '10',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [400, 390, 380, 370, 360, 355],
                                        borderColor: getLineColor([400, 390, 380, 370, 360, 355]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([400, 390, 380, 370, 360, 355]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([400, 390, 380, 370, 360, 355]) === 'rgba(75, 192, 192, 1)' ? "+5.00%" : "-5.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
        {
            namaCabang: 'Serpong',
            alamat: 'Jl. Serpong Raya No.5',
            totalPengunjung: '700',
            terlayani: '680',
            tidakTerlayani: '20',
            graphic: (
                <div className="flex items-center space-x-2">
                    <div className="w-40">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [
                                    {
                                        label: 'Pengunjung',
                                        data: [650, 660, 670, 680, 690, 700],
                                        borderColor: getLineColor([650, 660, 670, 680, 690, 700]),
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.4,
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                    <span className={getLineColor([650, 660, 670, 680, 690, 700]) === 'rgba(75, 192, 192, 1)' ? "text-green-500" : "text-red-500"}>
                        {getLineColor([650, 660, 670, 680, 690, 700]) === 'rgba(75, 192, 192, 1)' ? "+2.00%" : "-2.00%"}
                    </span>
                </div>
            ),
            option: 'Sedang Dilayani',
        },
    ], []);


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
            cell: (row: Cabang, index: number) => index + 1,
            width: "50px",
            center: true,
        },
        {
            name: "Nama Cabang",
            sortable: true,
            cell: (row: Cabang) => (
                <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{row.namaCabang}</span>
                </div>
            ),
            omit: !visibleColumns.namaCabang,
        },
        {
            name: "Alamat",
            selector: (row: Cabang) => row.alamat,
            sortable: true,
            omit: !visibleColumns.alamat,
        },
        {
            name: "Total Pengunjung",
            selector: (row: Cabang) => row.totalPengunjung,
            sortable: true,
            omit: !visibleColumns.totalPengunjung,
        },
        {
            name: "Terlayani",
            selector: (row: Cabang) => row.terlayani,
            sortable: true,
            omit: !visibleColumns.terlayani,
        },
        {
            name: "Tidak Terlayani",
            selector: (row: Cabang) => row.tidakTerlayani,
            sortable: true,
            omit: !visibleColumns.tidakTerlayani,
        },
        {
            name: "Graphic",
            selector: (row: Cabang) => row.graphic,
            sortable: false,
            omit: !visibleColumns.graphic,
        },
        {
            name: "Option",
            selector: (row: Cabang) => row.option,
            sortable: true,
            omit: !visibleColumns.option,
        },
    ];

    const filteredCabangs = useMemo(() => {
        return dataCabang.filter((cabang) =>
            cabang.namaCabang.toLowerCase().includes(search.toLowerCase()) ||
            cabang.alamat.toLowerCase().includes(search.toLowerCase()) ||
            cabang.totalPengunjung.toLowerCase().includes(search.toLowerCase()) ||
            cabang.terlayani.toLowerCase().includes(search.toLowerCase()) ||
            cabang.tidakTerlayani.toLowerCase().includes(search.toLowerCase()) ||
            cabang.option.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, dataCabang]);

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
                data={filteredCabangs}
                pagination
            />
        </div>
    );
};

export default CabangTable;
