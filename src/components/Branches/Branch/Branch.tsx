"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';
import { ClipLoader } from "react-spinners";
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<BranchItem | null>(null);
    const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


    useEffect(() => {
        fetchBranches(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleMouseEnter = (text: string, e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setTooltip({
            text,
            x: rect.left,
            y: rect.top + rect.height + 5,
            visible: true,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ text: "", x: 0, y: 0, visible: false });
    };

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

    const columns: TableColumn<BranchItem>[] = [
        {
            name: "No.",
            selector: (_: BranchItem, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
            sortable: false,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Code",
            selector: (row: BranchItem) => row.code,
            sortable: true,
            minWidth: "100px",
            grow: 0,
        },
        {
            name: "Branch Name",
            cell: (row: BranchItem) => (
                <div
                    onMouseEnter={(e) => handleMouseEnter(row.name, e)}
                    onMouseLeave={handleMouseLeave}
                    className="truncate w-40"
                >
                    {row.name}
                </div>
            ),
            sortable: true,
            minWidth: "150px",
            grow: 1,
        },
        {
            name: "Address",
            cell: (row: BranchItem) => (
                <div
                    onMouseEnter={(e) => handleMouseEnter(row.address || "-", e)}
                    onMouseLeave={handleMouseLeave}
                    className="truncate w-60"
                >
                    {row.address || "-"}
                </div>
            ),
            sortable: false,
            minWidth: "300px",
            grow: 2,
        },
        {
            name: "Actions",
            minWidth: "150px",
            grow: 1.5,
            cell: (row: BranchItem) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleDetail(row.id)}
                        className="text-blue-500 hover:underline flex items-center space-x-2"
                    >
                        <EyeIcon className="h-5 w-5" />
                        <span>Detail</span>
                    </button>

                    <button
                        className="text-green-500 hover:underline flex items-center space-x-2"
                        onClick={() => {
                            setIsEditModalOpen(true);
                            setEditData(row);
                        }
                        }
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span>Edit</span>
                    </button>

                    <button
                        className="text-red-500 hover:underline flex items-center space-x-2"
                        onClick={() => handleDelete(row.id)}
                    >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                    </button>
                </div>
            ),
        }
    ];

    const handleDetail = (id: number) => {
        fetchDetail(id);
        setIsDetailModalOpen(true);
    };

    const fetchDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/branches/branch/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch branch details.");
            }
            const data = await response.json();
            setDetailData(data.data);
        } catch (err: any) {
            console.error("Fetch error:", err);
            alert(err.message || "Error occurred while fetching branch details.");
        } finally {
            setLoading(false);
        }
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
            <h1 className="text-xl font-bold mb-4">Branch</h1>
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
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                    Create
                </button>
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
                    data={filteredBranches}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(size) => setPageSize(size)}
                    progressPending={loading}
                />
            )}

            {tooltip.visible && (
                <div
                    className="absolute bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-md"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: "translateY(0)",
                        zIndex: 1000,
                    }}
                >
                    {tooltip.text}
                </div>
            )}

            {/* Create Branch Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Create Branch"
                className="bg-white rounded-md w-1/3 p-6"
            >
                <h2 className="text-xl font-bold mb-4">Create Branch</h2>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Branch Name</label>
                    <input
                        type="text"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Address</label>
                    <input
                        type="text"
                        value={newBranch.address ?? ""}
                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
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

            {/* Edit Branch Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                contentLabel="Edit Branch"
                className="bg-white rounded-md w-1/3 p-6"
            >
                <h2 className="text-xl font-bold mb-4">Edit Branch</h2>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Branch Name</label>
                    <input
                        type="text"
                        value={editData?.name || ""}
                        onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Address</label>
                    <input
                        type="text"
                        value={editData?.address ?? ""}
                        onChange={(e) => setEditData({ ...editData!, address: e.target.value })}
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
                <h2 className="text-2xl font-semibold text-center mb-6">Branch Details</h2>
                {detailData ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">Name</td>
                                    <td className="px-4 py-2">{detailData.name}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">Address</td>
                                    <td className="px-4 py-2">{detailData.address || "-"}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">City</td>
                                    <td className="px-4 py-2">{detailData.city || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading details...</p>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Branch;
