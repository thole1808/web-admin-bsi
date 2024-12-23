"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface BranchItem {
    id: number;
    type: string;
    unit: string;
    code: string;
    name: string;
    address: string | null;
    city: string | null;
    phone: string | null;
    longitude: string | null;
    latitude: string | null;
    timezone: string | null;
    maxRoomCapacity: number;
    maxQueueCapacity: number;
    useCustomServiceType: boolean;
    regionId: number | null;
    regionName: string | null;
    areaId: number | null;
    areaName: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

const Branch: React.FC = () => {
    const [branches, setBranches] = useState<BranchItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<BranchItem | null>(null);
    const [newBranch, setNewBranch] = useState<Partial<BranchItem>>({
        name: "",
        address: "",
    });

    useEffect(() => {
        fetchBranches(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchBranches = async (page: number, size: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/branches/branch?page=${page}&size=${size}&sortBy=code&direction=DESC`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && data.data) {
                setBranches(data.data.content);
                setTotalRows(data.data.totalElements);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch (err) {
            setError("Error occurred while fetching branches.");
        } finally {
            setLoading(false);
        }
    };

    const filteredBranches = useMemo(
        () =>
            Array.isArray(branches)
                ? branches.filter((branch) =>
                      `${branch.name} ${branch.address ?? ""}`
                          .toLowerCase()
                          .includes(search.toLowerCase())
                  )
                : [],
        [search, branches]
    );

    const columns = [
        {
            name: "No.",
            selector: (_: BranchItem, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
            sortable: false,
        },
        {
            name: "Code",
            selector: (row: BranchItem) => row.code,
            sortable: true,
        },
        {
            name: "Branch Name",
            selector: (row: BranchItem) => row.name,
            sortable: true,
        },
        {
            name: "Address",
            selector: (row: BranchItem) => row.address || "-",
            sortable: false,
        },
        {
            name: "Actions",
            cell: (row: BranchItem) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleDetail(row)}
                        className="text-blue-500 hover:underline"
                    >
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

    const handleDetail = (row: BranchItem) => {
        alert(`Detail of Branch: ${row.name}`);
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBranch),
            });
            if (!response.ok) {
                throw new Error("Failed to create branch.");
            }
            fetchBranches(currentPage, pageSize);
            setNewBranch({ name: "", address: "" });
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while creating branch.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/branches/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update branch.");
            }
            fetchBranches(currentPage, pageSize);
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating branch.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;
        try {
            const response = await fetch(`/api/branches/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete branch.");
            }
            fetchBranches(currentPage, pageSize);
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting branch.");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Branch Management</h1>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-md w-1/2"
                />
                <button
                    onClick={() => {
                        setEditData(null);
                        setNewBranch({ name: "", address: "" });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                    Create
                </button>
            </div>

            <DataTable
                columns={columns}
                data={filteredBranches}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(size) => setPageSize(size)}
                progressPending={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-md p-6 w-1/3"
            >
                <h2 className="text-xl font-bold mb-4">
                    {editData ? "Edit Branch" : "Create Branch"}
                </h2>
                <input
                    type="text"
                    placeholder="Branch Name"
                    value={editData ? editData.name : newBranch.name}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, name: e.target.value })
                            : setNewBranch({ ...newBranch, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md mb-4"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={editData ? editData.address ?? "" : newBranch.address ?? ""}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, address: e.target.value })
                            : setNewBranch({ ...newBranch, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md mb-4"
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

export default Branch;
