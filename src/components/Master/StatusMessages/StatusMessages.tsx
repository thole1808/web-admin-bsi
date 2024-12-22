"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface StatusItem {
    id: number;
    message: string;
    status: string; // New field for status
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
            style: { width: "50px", textAlign: "center" as TextAlign },
        },
        {
            name: "Status",
            selector: (row: StatusItem) => row.status,  // New column for Status
            sortable: true,
        },
        {
            name: "Message",
            selector: (row: StatusItem) => row.message,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row: StatusItem) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
                        Detail
                    </button>
                    <button
                        className="text-green-500 hover:underline"
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Status Messages</h1>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-md w-1/2"
                />
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

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredStatuses}
                    pagination
                    highlightOnHover
                    striped
                />
            )}

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
        </div>
    );
};

export default StatusMessages;
