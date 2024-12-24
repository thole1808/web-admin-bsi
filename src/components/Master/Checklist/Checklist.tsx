"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ClipLoader } from "react-spinners";

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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
    const [currentItem, setCurrentItem] = useState<ChecklistItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 

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
                setIsCreateModalOpen(false); 
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

    const handleDetail = (row: ChecklistItem) => {
        fetchChecklistDetail(row.id);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsCreateModalOpen(false);
    };
    
    const fetchChecklistDetail = async (id: number) => {
        try {
            setLoading(true); 
            const response = await fetch(`/api/master/checklist/${id}`);
            if (!response.ok) throw new Error("Failed to fetch checklist detail.");
            const result = await response.json();
            
            if (result.success) {
            setCurrentItem(result.data); 
            setIsDetailModalOpen(true); 
            } else {
            alert(result.message || "Unknown error");
            }
        } catch (err: any) {
            alert(err.message || "Error occurred while fetching checklist detail.");
        } finally {
            setLoading(false); 
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
            selector: (row: ChecklistItem, index: number) => index + 1,
            sortable: false,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Activity Name",
            selector: (row: ChecklistItem) => row.activityName,
            sortable: true,
            minWidth: "50px",
            grow: 6,
        },
        {
            name: "Activity Type",
            selector: (row: ChecklistItem) => row.activityType,
            sortable: true,
            minWidth: "50px",
            grow: 2,
        },
        {
            name: "Mandatory",
            selector: (row: ChecklistItem) => (row.mandatory ? "Yes" : "No"),
            sortable: true,
            minWidth: "50px",
            grow: 2,
        },
        {
            name: "Actions",
            grow: 4,
            cell: (row: ChecklistItem) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => fetchChecklistDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                        >
                        <EyeIcon className="h-5 w-5" />
                        <span>Detail</span>
                    </button>

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
                        className="text-green-500 hover:underline flex items-center space-x-1"
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline flex items-center space-x-1"
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
            <h1 className="text-2xl font-bold mb-4">Checklist</h1>

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
                        onClick={() => setIsCreateModalOpen(true)}
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
                        data={filteredData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Create Checklist Item"
                className="modal"
            >
                <h2 className="text-xl font-bold">Create Checklist Item</h2>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Activity Name"
                        value={formData.activityName}
                        onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Activity Type"
                        value={formData.activityType}
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Edit Checklist Item"
                className="modal"
            >
                <h2 className="text-xl font-bold">Edit Checklist Item</h2>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Activity Name"
                        value={formData.activityName}
                        onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Activity Type"
                        value={formData.activityType}
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                            Cancel
                        </button>
                        <button
                            onClick={() => handleEdit(currentItem?.id ?? 0)}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                contentLabel="Detail Checklist Item"
                className="modal"
            >
                <div className="modal-content">
                    <h2 className="text-xl font-bold text-center mb-4">Checklist Detail</h2>
                    
                    {currentItem ? (
                        <table className="table-auto w-full border-collapse">
                            <tbody>
                                <tr className="">
                                    <td className="px-4 py-2 font-semibold text-gray-600">Activity Name</td>
                                    <td className="px-4 py-2">{currentItem.activityName}</td>
                                </tr>
                                <tr className="">
                                    <td className="px-4 py-2 font-semibold text-gray-600">Activity Type</td>
                                    <td className="px-4 py-2">{currentItem.activityType}</td>
                                </tr>
                                <tr className="">
                                    <td className="px-4 py-2 font-semibold text-gray-600">Mandatory</td>
                                    <td className="px-4 py-2">{currentItem.mandatory ? "Yes" : "No"}</td>
                                </tr>
                                <tr className="">
                                    <td className="px-4 py-2 font-semibold text-gray-600">Created At</td>
                                    <td className="px-4 py-2">{currentItem.createdAt}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-semibold text-gray-600">Updated At</td>
                                    <td className="px-4 py-2">{currentItem.updatedAt}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
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

export default Checklist;
