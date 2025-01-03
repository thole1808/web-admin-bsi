"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

// Import DataTable with dynamic loading
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface RoleItem {
    id: number;
    code: string;
    name: string;
    guardName: string;
    permissions: { id: number; name: string }[];
    createdAt: string;
    updatedAt: string;
}

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [editData, setEditData] = useState<RoleItem | null>(null);
    const [newRole, setNewRole] = useState<string>("");
    const [selectedPermissions, setSelectedPermissions] = useState<RoleItem | null>(null);
    const { data: session, status } = useSession();
    const [detailData, setDetailData] = useState<RoleItem | null>(null);

    useEffect(() => {
        fetchRoles();
    }, [session, status]);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/roles");
            if (!response.ok) {
                throw new Error(`Failed to fetch roles: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setRoles(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching roles.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newRole }),
            });
            if (!response.ok) {
                throw new Error("Failed to create role.");
            }
            fetchRoles();
            setNewRole("");
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while creating role.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/roles/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update role.");
            }
            fetchRoles();
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating role.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            const response = await fetch(`/api/roles/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete role.");
            }
            setRoles((prev) => prev.filter((role) => role.id !== id));
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting role.");
        }
    };

    const fetchRoleDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/roles/${id}`);
            if (!response.ok) throw new Error("Failed to fetch role details.");
            const data = await response.json();
            setDetailData(data.data);
            setIsDetailModalOpen(true);
        } catch (err: any) {
            alert(err.message || "Error occurred while fetching role details.");
        } finally {
            setLoading(false);
        }
    };

    const filteredRoles = useMemo(
        () =>
            roles.filter((role) =>
                role.name.toLowerCase().includes(search.toLowerCase())
            ),
        [search, roles]
    );

    const columns = [
        {
            name: "No.",
            selector: (_: RoleItem, index: number) => index + 1,
            sortable: true,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Role Name",
            selector: (row: RoleItem) => row.name,
            sortable: true,
            minWidth: "50px",
            grow: 2,
        },
        {
            name: "Guard",
            selector: (row: RoleItem) => row.guardName,
            sortable: true,
            minWidth: "50px",
            grow: 1,
        },
        {
            name: "Permissions",
            selector: (row: RoleItem) => row.permissions.length,
            sortable: true,
            minWidth: "20px",
            grow: 2,
            cell: (row: RoleItem) => (
                <button
                    className="text-orange-500 hover:underline"
                    onClick={() => {
                        setSelectedPermissions(row);
                        setIsPermissionsModalOpen(true);
                    }}
                >
                    View Permissions
                </button>
            ),
        },
        {
            name: "Actions",
            right: true,
            cell: (row: RoleItem) => (
                <div className="flex border border-gray-400 rounded divide-x divide-gray-400">
                    <button
                        onClick={() => fetchRoleDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 p-1.5"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
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
            <h1 className="text-2xl font-bold mb-4">Roles</h1>
            
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
                            setNewRole("");
                            setIsModalOpen(true);
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
                        data={filteredRoles}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>
            )}

            {/* Modal for Creating or Editing Role */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-md p-6 w-1/3"
            >
                <h2 className="text-xl font-bold mb-4">
                    {editData ? "Edit Role" : "Create Role"}
                </h2>
                <input
                    type="text"
                    value={editData ? editData.name : newRole}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, name: e.target.value })
                            : setNewRole(e.target.value)
                    }
                    className="border px-4 py-2 rounded-md w-full mb-4"
                    placeholder="Role Name"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={editData ? handleEdit : handleCreate}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        {editData ? "Update" : "Create"}
                    </button>
                </div>
            </Modal>

            {/* Modal for Viewing Permissions */}
            <Modal
                isOpen={isPermissionsModalOpen}
                onRequestClose={() => setIsPermissionsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-2/3 max-w-md shadow-lg"
            >
                {/* Header Modal */}
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Permissions</h2>
                    <button
                        onClick={() => setIsPermissionsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {selectedPermissions?.permissions?.length ? (
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {selectedPermissions.permissions.map((perm) => (
                                <li key={perm.id} className="text-lg">
                                    {perm.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">No permissions assigned.</p>
                    )}
                </div>
            </Modal>


            {/* Modal Detail Roles */}
            
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-center w-full">Role Detail</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {detailData ? (
                    <div className="grid gap-4">
                        {/* Role Name */}
                        <div>
                            <div className="text-sm text-gray-500">Role Name</div>
                            <div className="mt-1 font-medium">{detailData.name || "N/A"}</div>
                        </div>
                        {/* Code */}
                        <div>
                            <div className="text-sm text-gray-500">Code</div>
                            <div className="mt-1 font-medium">{detailData.code || "N/A"}</div>
                        </div>
                        {/* Guard Name */}
                        <div>
                            <div className="text-sm text-gray-500">Guard Name</div>
                            <div className="mt-1 font-medium">{detailData.guardName || "N/A"}</div>
                        </div>
                        {/* Permissions */}
                        <div>
                            <div className="text-sm text-gray-500">Permissions</div>
                            <ul className="list-disc pl-6 mt-1 mb-3">   
                                {detailData.permissions.length > 0 ? (
                                    detailData.permissions.map((permission) => (
                                        <li key={permission.id} className="text-lg text-gray-700">
                                            {permission.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No permissions available</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No details available.</p>
                )}
            </Modal>
            
        </div>
    );
};

export default Roles;
