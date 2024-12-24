"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';


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
            grow:3,
        },
        
        {
            name: "Guard",
            selector: (row: RoleItem) => row.guardName,
            sortable: true,
            minWidth: "50px",
            grow:1,
        },
        {
            name: "Permissions",
            selector: (row: RoleItem) => row.permissions.length,
            sortable: true,
            minWidth: "20px",
            grow:2,
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
            grow:2,
            cell: (row: RoleItem) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => fetchRoleDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                    >
                        <EyeIcon className="h-5 w-5" />
                        <span>Detail</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
                        }}
                        className="text-green-500 hover:text-green-700 flex items-center space-x-1"
                    >
                        <PencilIcon className="h-5 w-5" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-1"
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
            <h1 className="text-2xl font-bold mb-4">Roles</h1>

            {/* Search Input and Create Button */}
            <div className="flex justify-between mb-4">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full pr-10" // Add padding-right for the icon
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
                <button
                    onClick={() => {
                        setEditData(null);
                        setNewRole("");
                        setIsModalOpen(true);
                    }}
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
                        // selectableRows
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
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={editData ? handleEdit : handleCreate}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        {editData ? "Update" : "Create"}
                    </button>
                </div>
            </Modal>

            {/* modal permsion detail */}
            <Modal
                isOpen={isPermissionsModalOpen}
                onRequestClose={() => setIsPermissionsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Permissions for {selectedPermissions?.name}
                </h2>

                <div className="mb-4">
                    {selectedPermissions?.permissions?.length === 0 ? (
                        <p className="text-center text-gray-500">Roles Permission tidak ada</p>
                    ) : (
                        <ul className="space-y-2 mt-2">
                            {selectedPermissions?.permissions.map((permission) => (
                                <li
                                    key={permission.id}
                                    className="flex items-center justify-between px-4 py-2 border-b border-gray-200 rounded-md hover:bg-gray-100"
                                >
                                    <span className="text-sm text-gray-700">{permission.name}</span>
                                    <span
                                        className="text-xs text-gray-500"
                                        title={`Permission ID: ${permission.id}`}
                                    >
                                        {/* {permission.id} */}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => setIsPermissionsModalOpen(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </Modal>
            {/* Modal for Permissions */}

            {/* Modal Detail Roles */}
            <Modal
                isOpen={isDetailModalOpen} // Gunakan state khusus untuk modal detail
                onRequestClose={() => setIsDetailModalOpen(false)} // Menutup modal
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Role Detail</h2>

                {detailData ? (
                    <div className="overflow-x-auto">
                        {/* Tabel untuk menampilkan detail role */}
                        <table className="min-w-full table-auto">
                            <tbody>
                                {/* Row untuk Role Name */}
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">Role Name</td>
                                    <td className="px-4 py-2">{detailData.name}</td>
                                </tr>
                                {/* Row untuk Code */}
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">Code</td>
                                    <td className="px-4 py-2">{detailData.code}</td>
                                </tr>
                                {/* Row untuk Guard Name */}
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600">Guard Name</td>
                                    <td className="px-4 py-2">{detailData.guardName}</td>
                                </tr>

                                {/* Row untuk Permissions List */}
                                <tr className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-600 align-top">Permissions</td>
                                    <td className="px-4 py-2">
                                        <ul className="list-disc pl-6">
                                            {detailData.permissions.map((permission) => (
                                                <li key={permission.id} className="text-lg">{permission.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No details available.</p>
                )}

                {/* Button to Close Modal */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsDetailModalOpen(false)} // Menutup modal
                        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </Modal>
            {/* Modal Detail Roles */}

        </div>
    );
};

export default Roles;
