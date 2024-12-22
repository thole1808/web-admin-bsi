"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';

const DataTable = dynamic(() => import("react-data-table-component"), {
    ssr: false,
});

interface ChecklistItem {
    id: number;
    num: number;
    activityName: string;
    activityType: string;
    mandatory: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

const Checklist: React.FC = () => {
    const [search, setSearch] = useState("");
    const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<ChecklistItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For Create Modal

    const [formData, setFormData] = useState({
        activityName: "",
        activityType: "",
        mandatory: false,
    });

    // Fetch data from API
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/checklist");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                setChecklistData(result.data);
            } else {
                throw new Error(result.message || "Unknown error");
            }
        } catch (error: any) {
            setError(error.message || "Error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    // Handle create new activity
    const handleCreate = async () => {
        try {
            const response = await fetch("/api/master/checklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const newItem = await response.json();
                setChecklistData((prevData) => [...prevData, newItem.data]);
                setFormData({ activityName: "", activityType: "", mandatory: false });
                setIsModalOpen(false);
            } else {
                alert("Failed to create activity.");
            }
        } catch {
            alert("Error occurred while creating activity.");
        }
    };

    // Handle edit activity
    const handleEdit = async (id: number) => {
        try {
            const response = await fetch(`/api/master/checklist/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const updatedItem = await response.json();
                setChecklistData((prevData) =>
                    prevData.map((item) => (item.id === id ? updatedItem.data : item))
                );
                setFormData({ activityName: "", activityType: "", mandatory: false });
                setCurrentItem(null);
                setIsModalOpen(false);
            } else {
                alert("Failed to update activity.");
            }
        } catch {
            alert("Error occurred while updating activity.");
        }
    };

    // Handle delete activity
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/master/checklist/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setChecklistData((prevData) =>
                    prevData.filter((item) => item.id !== id)
                );
            } else {
                alert("Failed to delete activity.");
            }
        } catch {
            alert("Error occurred while deleting activity.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = checklistData.filter((item) =>
        item.activityName.toLowerCase().includes(search.toLowerCase())
    );

    const columns: TableColumn<ChecklistItem>[] = [
        {
            name: "No.",
            selector: (row: ChecklistItem, index: number) => index + 1, // Add serial number
            sortable: false,
            style: { width: "50px", textAlign: "center" },
        },
        {
            name: "Activity Name",
            selector: (row: ChecklistItem) => row.activityName,
            sortable: true,
        },
        {
            name: "Activity Type",
            selector: (row: ChecklistItem) => row.activityType,
            sortable: true,
        },
        {
            name: "Mandatory",
            selector: (row: ChecklistItem) => (row.mandatory ? "Yes" : "No"),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row: ChecklistItem) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setFormData({
                                activityName: row.activityName,
                                activityType: row.activityType,
                                mandatory: row.mandatory,
                            });
                            setCurrentItem(row);
                            setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Checklist</h1>

            <div className="flex justify-between mb-4">
                <div className="w-1/2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 w-full rounded-md"
                    />
                </div>
                <div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                />
            )}

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold">{currentItem ? "Edit Activity" : "Add Activity"}</h2>
                <input
                    type="text"
                    value={formData.activityName}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, activityName: e.target.value }))
                    }
                    placeholder="Activity name"
                    className="border px-4 py-2 w-full mt-2 mb-4 rounded-md"
                />
                <input
                    type="text"
                    value={formData.activityType}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, activityType: e.target.value }))
                    }
                    placeholder="Activity type"
                    className="border px-4 py-2 w-full mt-2 mb-4 rounded-md"
                />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={formData.mandatory}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, mandatory: e.target.checked }))
                        }
                    />
                    <span>Mandatory</span>
                </label>
                <button
                    onClick={() => (currentItem ? handleEdit(currentItem.id) : handleCreate())}
                    className="bg-green-500 text-white px-6 py-2 rounded-md mt-4"
                >
                    Save
                </button>
            </Modal>
        </div>
    );
};

export default Checklist;