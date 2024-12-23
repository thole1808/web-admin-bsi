"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";

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
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [editData, setEditData] = useState<RoleItem | null>(null);
    const [newRole, setNewRole] = useState<string>("");
    const [selectedPermissions, setSelectedPermissions] = useState<RoleItem | null>(null);
    const { data: session, status } = useSession();

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

    const handleDetail = (row: RoleItem) => {
        console.log("Detail of", row);
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
            style: { width: "50px", textAlign: "center" as "left" },
        },
        {
            name: "Role Name",
            selector: (row: RoleItem) => row.name,
            sortable: true,
        },
        {
            name: "Permissions",
            selector: (row: RoleItem) => row.permissions.length, // Return the count of permissions
            sortable: true,
            cell: (row: RoleItem) => (
                <button
                    className="text-blue-500 hover:underline"
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
            cell: (row: RoleItem) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
                        Detail
                    </button>
                    <button
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
                        }}
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


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Roles</h1>

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
                        setNewRole("");
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                    Create Role
                </button>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredRoles}
                    pagination
                    highlightOnHover
                    striped
                />
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
                    className="w-full px-4 py-2 border rounded-md"
                />
                <button
                    onClick={editData ? handleEdit : handleCreate}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                    Save
                </button>
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
            
        </div>
    );
};

export default Roles;
