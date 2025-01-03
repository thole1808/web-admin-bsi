"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface NationalHolidayItem {
    id: number;
    date: string;
    name: string;
}

const NationalHolidayMessages: React.FC = () => {
    const [holidays, setHolidays] = useState<NationalHolidayItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
    const [editData, setEditData] = useState<NationalHolidayItem | null>(null);
    const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
    const [holidayDetail, setHolidayDetail] = useState<NationalHolidayItem | null>(null); 
    const { data: session, status } = useSession();
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchHolidays();
    }, [session, status]);

    const handleDetail = async (row: NationalHolidayItem) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/master/national-holidays/${row.id}`);
            const data = await response.json();
            if (data.success && data.data) {
                setHolidayDetail(data.data); 
                setIsDetailModalOpen(true);
            } else {
                alert("Failed to fetch holiday details.");
            }
        } catch (err) {
            alert("Error occurred while fetching holiday details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/national-holidays");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setHolidays(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching national holidays.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/national-holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newHoliday),
            });
            if (!response.ok) {
                throw new Error("Failed to create holiday.");
            }
            fetchHolidays();
            setNewHoliday({ date: "", name: "" });
            setIsCreateModalOpen(false); 
        } catch (err: any) {
            alert(err.message || "Error occurred while creating holiday.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/national-holidays/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update holiday.");
            }
            fetchHolidays();
            setIsEditModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating holiday.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this holiday?")) return;
        try {
            const response = await fetch(`/api/national-holidays/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete holiday.");
            }
            setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting holiday.");
        }
    };

    const filteredHolidays = useMemo(
        () =>
            Array.isArray(holidays)
                ? holidays.filter((holiday) => {
                    return holiday.name?.toLowerCase().includes(search.toLowerCase());
                })
                : [],
        [search, holidays]
    );

    const columns = [
        {
            name: "No.",
            selector: (_: NationalHolidayItem, index: number) => index + 1,
            sortable: true,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Date",
            selector: (row: NationalHolidayItem) => row.date,
            sortable: true,
            minWidth: "150px",
            grow: 0,
        },
        {
            name: "Holiday Name",
            selector: (row: NationalHolidayItem) => row.name,
            sortable: true,
            minWidth: "50px",
            grow: 2,
        },
        {
            name: "Actions",
            right: true,
            cell: (row: NationalHolidayItem) => (
                <div className="flex border border-gray-400 rounded divide-x divide-gray-400">
                    <button
                        onClick={() => handleDetail(row)}
                        className="text-blue-500 hover:text-blue-700 p-1.5"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => {
                            setEditData(row);
                            setIsEditModalOpen(true); 
                        }}
                        className="text-green-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        }

    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">National Holidays</h1>

            {/* Search Input and Create Button */}
            <div className="flex justify-between mb-4">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 rounded-md w-full pr-10 border"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
                <div>
                    <button
                        onClick={() => {
                            setEditData(null);
                            setNewHoliday({ date: "", name: "" });
                            setIsCreateModalOpen(true); 
                        }}
                        className="bg-teal-500 text-sm font-medium tracking-wide text-white px-4 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>


            {loading ? (
                <div className="relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <ClipLoader size={50} color="#4B5563" loading={loading} />
                    </div>
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredHolidays}
                    pagination
                    highlightOnHover
                    pointerOnHover
                />
            )}

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Create Holiday"
                className="bg-white rounded-md w-1/3 p-6"
            >
                <h2 className="text-xl font-bold mb-4">Create National Holiday</h2>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Holiday Name</label>
                    <input
                        type="text"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Date</label>
                    <input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsCreateModalOpen(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                contentLabel="Edit Holiday"
                className="bg-white rounded-md w-1/3 p-6"
            >
                <h2 className="text-xl font-bold mb-4">Edit National Holiday</h2>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Holiday Name</label>
                    <input
                        type="text"
                        value={editData?.name || ""}
                        onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Date</label>
                    <input
                        type="date"
                        value={editData?.date || ""}
                        onChange={(e) => setEditData({ ...editData!, date: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Update
                    </button>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-center">Holiday Detail</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {holidayDetail ? (
                    <div className="grid gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Holiday Name</div>
                            <div className="mt-1 font-medium">{holidayDetail.name || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="mt-1 mb-3 font-medium">
                                {holidayDetail.date
                                    ? new Date(holidayDetail.date).toLocaleDateString()
                                    : "N/A"}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No details available.</p>
                )}
            </Modal>
        </div>
    );
};

export default NationalHolidayMessages;
