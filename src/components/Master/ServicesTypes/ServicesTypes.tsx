"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal";

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
        // {
        //     name: "No.",
        //     selector: (_: ServiceTypeItem, index: number) => index + 1,
        //     sortable: false,
        //     style: { width: "50px", textAlign: "center" },
        // },
        {
            name: "No.",
            selector: (_: ServiceTypeItem, index: number) => index + 1,
            sortable: true,
            style: { width: "50px", textAlign: "center" as TextAlign },
        },
        
        {
            name: "Service Type",
            selector: (row: ServiceTypeItem) => row.name,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row: ServiceTypeItem) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
                        Detail
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-green-500 hover:underline"
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

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 w-1/2 rounded-md"
                />
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                    Create
                </button>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                />

                // <DataTable columns={columns} data={data} />
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
