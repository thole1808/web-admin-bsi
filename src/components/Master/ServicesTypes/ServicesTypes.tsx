"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';


const DataTable = dynamic(() => import("react-data-table-component"), {
    ssr: false,
});

interface ServiceTypeItem {
    id: number;
    name: string;
}

const ServicesTypes: React.FC = () => {
    const [search, setSearch] = useState("");
    const [servicesData, setServicesData] = useState<ServiceTypeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editData, setEditData] = useState<ServiceTypeItem | null>(null);
    const [newService, setNewService] = useState<{ name: string }>({ name: "" });
    type TextAlign = "left" | "center" | "right";
    const { data: session, status } = useSession();
    const [currentItem, setCurrentItem] = useState<ServiceTypeItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/services-types");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setServicesData(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDetail = (row: ServiceTypeItem) => {
        console.log("Detail of", row);
    };

    const fetchChecklistDetail = async (id: number) => {
        try {
            setLoading(true); 
            const response = await fetch(`/api/master/services-types/${id}`);
            if (!response.ok) throw new Error("Failed to fetch services types detail.");
            const result = await response.json();
            
            if (result.success) {
            setCurrentItem(result.data); 
            setIsDetailModalOpen(true); 
            } else {
            alert(result.message || "Unknown error");
            }
        } catch (err: any) {
            alert(err.message || "Error occurred while fetching services types detail.");
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchData();
    }, [session, status]);

    const filteredData = useMemo(() => {
        const searchTerm = search.toLowerCase();
        return servicesData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm)
        );
    }, [search, servicesData]);

    const columns = [
        {
            name: "No.",
            selector: (_: ServiceTypeItem, index: number) => index + 1,
            sortable: true,
            maxWidth: "1px",
            minWidth: "70px",
        },

        {
            name: "Service Type",
            selector: (row: ServiceTypeItem) => row.name,
            sortable: true,
            minWidth: "50px",
            grow: 1,
        },
        {
            name: "Actions",
            minWidth: "50px",
            grow: 1,
            cell: (row: ServiceTypeItem) => (
                <div className="flex space-x-2">
                    {/* Detail Button */}
                    <button
                        onClick={() => fetchChecklistDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                    >
                        <EyeIcon className="h-5 w-5" />
                        <span>Detail</span>
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={() => {
                            setCurrentItem(row);
                            setIsModalOpen(true);
                        }}
                        className="text-green-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm"
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm"
                    >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                    </button>
                </div>
            ),
        }
    ];

    const handleEdit = (row: ServiceTypeItem) => {
        setEditData({ ...row });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const response = await fetch(`/api/master/service-types/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setServicesData((prevData) =>
                        prevData.filter((item) => item.id !== id)
                    );
                } else {
                    alert("Failed to delete item.");
                }
            } catch {
                alert("Error occurred while deleting item.");
            }
        }
    };

    const handleSave = async () => {
        if (!editData) return;

        try {
            const response = await fetch(`/api/master/service-types/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                fetchData();
                setIsModalOpen(false);
            } else {
                alert("Failed to update item.");
            }
        } catch {
            alert("Error occurred while saving item.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-left">Service Types</h1>

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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Edit Service Type"
                className="modal"
            >
                {editData && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Edit Service Type</h2>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md">
                            Save
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ServicesTypes;
