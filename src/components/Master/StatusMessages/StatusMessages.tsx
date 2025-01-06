"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface StatusItem {
    id: number;
    message: string;
    status: string;
}

interface Errors {
    statusName?: string;
    statusMessage?: string;
}

const StatusMessages: React.FC = () => {
    const [statuses, setStatuses] = useState<StatusItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editData, setEditData] = useState<StatusItem | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [newMessage, setNewMessage] = useState(""); 
    const { data: session, status } = useSession();
    const [currentItem, setCurrentItem] = useState<StatusItem | null>(null);

    useEffect(() => {
        fetchStatuses();
    }, [session, status]);

    const handleDetail = (row: StatusItem) => {
        setCurrentItem(row);
        setIsDetailModalOpen(true);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
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

    const handleValidation = () => {
        const newErrors: Errors = {};
        let valid = true;

        if (!newStatus?.trim()) {
            newErrors.statusName = "Status Name is required.";
            valid = false;
        } else if (newStatus !== newStatus.toUpperCase()) {
            newErrors.statusName = "Status Name must be in uppercase.";
            valid = false;
        }

        if (!newMessage?.trim()) {
            newErrors.statusMessage = "Status Message is required.";
            valid = false;
        }
        setErrors(newErrors);

        return valid;
    };

    const capitalizeFirstLetter = (str: string) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleCreate = async () => {
        if (!handleValidation()) return;
        try {
            const requestBody = {
                statusName: newStatus,
                statusMessage: newMessage,
            };
            const response = await fetch("/api/master/status-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Status created:", data);
                setIsCreateModalOpen(false);
                setNewStatus("");
                setNewMessage("");
                fetchStatuses();
                setStatusMessage("Status created successfully!");
            } else {
                console.error("Failed to create status.");
                alert("Failed to create status.");
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message || "Error occurred while creating status.");
            setStatusMessage("Failed to create status. Please try again.");
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
            setIsEditModalOpen(false);
            setStatusMessage("Status updated successfully!");
        } catch (err: any) {
            alert(err.message || "Error occurred while updating status.");
            setStatusMessage("Failed to update status. Please try again.");
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
            setStatusMessage("Status deleted successfully!");
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting status.");
            setStatusMessage("Failed to delete status. Please try again.");
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
            right: true,
            cell: (row: StatusItem) => (
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
                            setStatusMessage("");
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
            <h1 className="text-2xl font-bold mb-4">Status Messages</h1>

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
                            setNewStatus("");
                            setIsCreateModalOpen(true);
                            setStatusMessage("");
                            setErrors({});
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

            {/* Create Status Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Create Status"
                className="modal"
            >
                <h2 className="text-xl font-bold mb-4">Create Status</h2>

                {/* Input for Status Name */}
                <div className="mb-3">
                    <label htmlFor="statusName" className="block text-sm font-medium text-gray-700 mb-1">
                        Status Name
                    </label>
                    <input
                        id="statusName"
                        type="text"
                        placeholder="Enter status name"
                        value={newStatus || ""}
                        onChange={(e) => setNewStatus(e.target.value.toUpperCase())}
                        className={`border px-4 py-2 rounded-md w-full ${errors.statusName ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.statusName && (
                        <p className="text-red-500 text-xs mt-1">{errors.statusName}</p>
                    )}
                </div>

                {/* Message Input */}
                <div className="mb-3">
                    <label htmlFor="statusMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <input
                        id="statusMessage"
                        type="text"
                        placeholder="Enter message"
                        value={newMessage || ""}
                        onChange={(e) => setNewMessage(capitalizeFirstLetter(e.target.value))}
                        className={`border px-4 py-2 rounded-md w-full ${errors.statusMessage ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.statusMessage && (
                        <p className="text-red-500 text-xs mt-1">{errors.statusMessage}</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </Modal>

            {/* Edit Status Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                className="bg-white rounded-md p-6 w-1/3"
            >
                <h2 className="text-xl font-bold mb-4">Edit Status</h2>
                {editData && (
                    <>
                        <input
                            type="text"
                            value={editData.message}
                            onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                                Cancel
                            </button>
                            <button onClick={handleEdit} className="bg-blue-500 text-white px-6 py-2 rounded-md">
                                Update
                            </button>
                        </div>
                        {statusMessage && <p className="mt-2 text-green-500">{statusMessage}</p>}
                    </>
                )}
            </Modal>

            {/* Detail Status Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-center">Status Detail</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 mt-4">Loading...</p>
                ) : currentItem ? (
                    <div className="grid gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="mt-1 font-medium">{currentItem.status || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Message</div>
                            <div className="mt-1 mb-3 font-medium">{currentItem.message || "N/A"}</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No data available</p>
                )}
            </Modal>
        </div>
    );
};

export default StatusMessages;
