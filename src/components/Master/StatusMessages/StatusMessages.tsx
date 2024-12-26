"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface StatusItem {
    id: number;
    message: string;
    status: string;
}

const StatusMessages: React.FC = () => {
    const [statuses, setStatuses] = useState<StatusItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<StatusItem | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const { data: session, status } = useSession();
    type TextAlign = "left" | "center" | "right";
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<StatusItem | null>(null);

    useEffect(() => {
        fetchStatuses();
    }, [session, status]);

    const handleDetail = (row: StatusItem) => {
        console.log("Detail of", row);
    };

    const fetchStatuses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/status-messages");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setStatuses(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching statuses.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/status-messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to create status.");
            }
            fetchStatuses();
            setNewStatus("");
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while creating status.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/status-messages/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update status.");
            }
            fetchStatuses();
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating status.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this status?")) return;
        try {
            const response = await fetch(`/api/status-messages/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete status.");
            }
            setStatuses((prev) => prev.filter((status) => status.id !== id));
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting status.");
        }
    };

    const fetchStatusDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/master/status-messages/${id}`);
            if (!response.ok) throw new Error("Failed to fetch status detail.");

            const result = await response.json();

            if (result.success) {
                setCurrentItem(result.data);
                setIsDetailModalOpen(true);
            } else {
                alert(result.message || "Unknown error");
            }
        } catch (err) {
            alert(err.message || "Error occurred while fetching status detail.");
        } finally {
            setLoading(false);
        }
    };

    const filteredStatuses = useMemo(
        () =>
            Array.isArray(statuses)
                ? statuses.filter((status) =>
                    status.message.toLowerCase().includes(search.toLowerCase())
                )
                : [],
        [search, statuses]
    );

    const columns = [
        {
            name: "No.",
            selector: (_: StatusItem, index: number) => index + 1,
            sortable: true,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Status",
            selector: (row: StatusItem) => row.status, 
            sortable: true,
            minWidth: "150px",
            grow: 0,
        },
        {
            name: "Message",
            selector: (row: StatusItem) => row.message,
            sortable: true,
            minWidth: "50px",
            grow: 2,
        },
        {
            name: "Actions",
            minWidth: "50px", 
            grow: 1,
            cell: (row: StatusItem) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => fetchStatusDetail(row.id)}
                        className="flex items-center text-blue-500 hover:text-blue-700 text-xs sm:text-sm px-2 py-1"
                    >
                        <EyeIcon className="h-5 w-5" />
                        <span>Detail</span>
                    </button>
        
                    <button
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center text-green-500 hover:text-green-700 text-xs sm:text-sm px-2 py-1"
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span>Edit</span>
                    </button>
        
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="flex items-center text-red-500 hover:text-red-700 text-xs sm:text-sm px-2 py-1"
                    >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                    </button>
                </div>
            ),
        },
        
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Status Messages</h1>

            {/* Search Input and Create Button */}
            <div className="flex justify-between mb-4">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full pr-10"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
                <div>
                    <button
                        onClick={() => {
                            setEditData(null);
                            setNewStatus("");
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
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
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="relative">
                    <DataTable
                        columns={columns}
                        data={filteredStatuses}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>
            )}

            {/* Edit  & Create Status */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-md p-6 w-1/3"
            >
                <h2 className="text-xl font-bold mb-4">
                    {editData ? "Edit Status" : "Create Status"}
                </h2>
                <input
                    type="text"
                    value={editData ? editData.message : newStatus}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, message: e.target.value })
                            : setNewStatus(e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-md"
                />
                <button
                    onClick={editData ? handleEdit : handleCreate}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                    Save
                </button>
            </Modal>

            {/* Detail Status */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                contentLabel="Detail Status Message"
                className="modal"
            >
                <div className="modal-content">
                    <h2 className="text-xl font-bold text-center mb-4">Status Detail</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : currentItem ? (
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 font-semibold text-gray-600 border">Status</td>
                                    <td className="px-4 py-2 border">{currentItem.status}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-semibold text-gray-600 border">Message</td>
                                    <td className="px-4 py-2 border">{currentItem.message}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available</p>
                    )}

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StatusMessages;
