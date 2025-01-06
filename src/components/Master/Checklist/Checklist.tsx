"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
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

interface Errors {
    activityName?: string;
    activityType?: string;
    [key: string]: string | undefined;
}


const Checklist: React.FC = () => {
    const [search, setSearch] = useState("");
    const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<ChecklistItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        activityName: "",
        activityType: "",
        // mandatory: true,
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
                const sortedData = result.data.sort((a: ChecklistItem, b: ChecklistItem) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setChecklistData(sortedData);
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
        if (!handleValidation()) return;
        try {
            const response = await fetch("/api/master/checklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Activity created:", data);
                setIsCreateModalOpen(false);
                fetchData();
            } else {
                console.error("Failed to create activity.");
                alert("Failed to create activity.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error);
        }
    };

    // Handle Validate 
    const handleValidation = () => {
        const newErrors: Errors = {};
        if (!formData.activityName?.trim()) {
            newErrors.activityName = "Activity Name is required.";
        }
        if (!formData.activityType?.trim()) {
            newErrors.activityType = "Activity Type is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle edit activity
    const handleEdit = async (id: number) => {
        if (!handleValidation()) return;
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
                setFormData({ activityName: "", activityType: "" });
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
        setErrors({});
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsCreateModalOpen(false);
        setErrors({});
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
            name: "Activity",
            selector: (row: ChecklistItem) => row.activityName,
            sortable: true,
            minWidth: "200px",
            wrap: true,
            grow: 3,
        },
        {
            name: "Type",
            selector: (row: ChecklistItem) => row.activityType,
            sortable: true,
            minWidth: "50px",
        },
        {
            name: "Mandatory",
            selector: (row: ChecklistItem) => (row.mandatory ? "Yes" : "No"),
            sortable: true,
            center: true,
        },
        {
            name: "Created at",
            selector: (row: ChecklistItem) => (
                new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }).format(new Date(row.createdAt))
            ),
            sortable: true,
            right: true,
        },
        {
            name: "Updated at",
            selector: (row: ChecklistItem) => (
                new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }).format(new Date(row.updatedAt))
            ),
            sortable: true,
            right: true,
        },
        {
            name: "Actions",
            right: true,
            cell: (row: ChecklistItem) => (
                <div className="flex border border-gray-400 rounded divide-x divide-gray-400">
                    <button
                        onClick={() => fetchChecklistDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 p-1.5"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => {
                            setFormData({
                                activityName: "",
                                activityType: "",
                            });
                            setCurrentItem(row);
                            setErrors({});
                            setIsModalOpen(true);
                            setFormData({
                                activityName: row.activityName,
                                activityType: row.activityType,
                            });
                        }}
                        className="text-orange-500 hover:text-orange-700 p-1.5"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:text-red-700 p-1.5"
                    >
                        <TrashIcon className="h-5 w-5" />
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
                        className="px-4 py-2 rounded-md w-full pr-10 border"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
                <div>
                    <button
                        onClick={() => {
                            setFormData({
                                activityName: "",
                                activityType: "",
                            });
                            setErrors({});
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
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="bg-white py-1 rounded-lg border">
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
                contentLabel="Create"
                className="modal"
            >
                <h2 className="text-xl font-bold mb-4">Create Activity</h2>

                {/* Input for Activity Name */}
                <div className="mb-3">
                    <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Name
                    </label>
                    <input
                        id="activityName"
                        type="text"
                        placeholder="Enter activity name"
                        value={formData.activityName || ""}
                        onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                        className={`border px-4 py-2 rounded-md w-full ${errors.activityName ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.activityName && (
                        <p className="text-red-500 text-xs mt-1">{errors.activityName}</p>
                    )}
                </div>

                {/* Select Dropdown for Activity Type */}
                <div className="mb-4">
                    <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Type
                    </label>
                    <select
                        id="activityType"
                        value={formData.activityType}
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                        className={`border px-4 py-2 rounded-md w-full ${errors.activityType ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="" disabled>
                            Select Activity Type
                        </option>
                        <option value="SOD">SOD</option>
                        <option value="EOD">EOD</option>
                    </select>
                    {errors.activityType && (
                        <p className="text-red-500 text-xs mt-1">{errors.activityType}</p>
                    )}
                </div>

                {/* Toggle for Mandatory */}
                {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mandatory
                    </label>
                    <div
                        className="relative cursor-pointer w-10 h-6 flex items-center"
                        onClick={() => setFormData({ ...formData, mandatory: !formData.mandatory })}
                    >
                        <input
                            type="checkbox"
                            id="mandatory-toggle"
                            checked={formData.mandatory}
                            onChange={() => { }}
                            className="sr-only"
                        />
                        <div
                            className={`block w-10 h-6 rounded-full ${formData.mandatory ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        ></div>
                        <div
                            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${formData.mandatory ? "transform translate-x-4" : ""
                                }`}
                        ></div>
                    </div>
                </div> */}

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

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                contentLabel="Edit"
                className="modal"
            >
                <h2 className="text-xl font-bold">Edit</h2>
                <div className="mt-4">
                    <div className="grid">
                        {/* Activity Name */}
                        <div>
                            <div className="text-sm text-gray-500">Activity</div>
                            <div className="mt-1 font-medium">
                                <input
                                    type="text"
                                    placeholder="Activity Name"
                                    value={formData.activityName}
                                    onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                                    className={`border border-gray-300 text-sm p-2 rounded-md w-full ${errors.activityName ? "border-red-500" : ""}`}
                                />
                                {errors.activityName && (
                                    <div className="text-xs text-red-500 mt-1">{errors.activityName}</div>
                                )}
                            </div>
                        </div>

                        {/* Activity Type */}
                        <div>
                            <div className="text-sm text-gray-500">Type</div>
                            <div className="mt-1 font-medium">
                                <select
                                    value={formData.activityType}
                                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                                    className={`border border-gray-300 text-sm p-3 rounded-md w-full ${errors.activityType ? "border-red-500" : ""}`}
                                >
                                    <option value="SOD">SOD</option>
                                    <option value="EOD">EOD</option>
                                </select>
                                {errors.activityType && (
                                    <div className="text-xs text-red-500 mt-1">{errors.activityType}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-8">
                        <button
                            onClick={handleModalClose}
                            className="bg-gray-500 text-white text-sm px-2 py-1 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleEdit(currentItem?.id ?? 0)}
                            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md"
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
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Checklist Detail</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {currentItem ? (
                    <div className="grid gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Activity Name</div>
                            <div className="mt-1 font-medium">{currentItem.activityName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Activity Type</div>
                            <div className="mt-1 font-medium">{currentItem.activityType}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Mandatory</div>
                            <div className="mt-1 font-medium">{currentItem.mandatory ? "Yes" : "No"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Created At</div>
                            <div className="mt-1 font-medium">
                                {new Intl.DateTimeFormat("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(new Date(currentItem.createdAt))}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Updated At</div>
                            <div className="mt-1 mb-3 font-medium">
                                {new Intl.DateTimeFormat("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(new Date(currentItem.updatedAt))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
            </Modal>
        </div>
    );
};

export default Checklist;
