"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import ExportCSV from "@/components/Button/ExportCsvButton";
import UserCreate from "./UserCreate";
import UserDelete from "./UserDelete";
import UserEdit from "./UserEdit";

const UserList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string | null>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [roleField, setRoleField] = useState("");
    const [statusField, setStatusField] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roles, setRoles] = useState<any[]>([]);
    const [isCreate, setIsCreate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(
                    `/api/access/roles`
                );

                const result = await response.json();

                if (result.success) {
                    setRoles(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch roles");
                }
            } catch (err: any) {
                console.log(err.message);
            }
        };

        fetchRoles();
    }, []);

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const handleRoleChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleField(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const size = perPage.toString();
                const page = (currentPage - 1).toString();
                const sortBy = sortField ? sortField : "id";
                const direction = sortDirection.toString();
                const status = statusField.toString();
                const search = debouncedSearch;
                const roleName = roleField;

                const queryParams = new URLSearchParams({
                    size,
                    page,
                    sortBy,
                    direction,
                    roleName,
                    status,
                    search
                });

                const response = await fetch(
                    `/api/access/users?${queryParams.toString()}`
                );

                const result = await response.json();

                if (result.success) {
                    setData(result.data.content);
                    setTotalRows(result.data.totalElements);
                } else {
                    throw new Error(result.message || "Failed to fetch users");
                }
            } catch (err: any) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isEdit || isCreate || isDelete) return;

        fetchData();
    }, [perPage, currentPage, sortField, sortDirection, statusField, debouncedSearch, roleField, isEdit, isCreate, isDelete]);

    const Export: React.FC<{ onExport: () => void }> = ({ onExport }) => (
        <button className="text-xs py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700 mr-2" onClick={() => onExport()}>Download CSV</button>
    );

    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = async (column: any, sortDirection: "asc" | "desc") => {
        setSortField(column.selector);
        setSortDirection(sortDirection);
    };

    const handleResetFilter = () => {
        setStatusField("");
        setRoleField("");
        setSearch("");
    };

    function formatDateTime(date: string) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID');
    }

    const columns = [
        {
            name: 'Employee ID',
            selector: (row: { officialId: any; }) => row?.officialId || '-',
            sortable: true,
            sortField: 'officialId',
        },
        {
            name: 'Name',
            selector: (row: { name: any; }) => row?.name || '',
            grow: 2,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Email',
            selector: (row: { email: any; }) => row?.email || '',
            grow: 2,
            sortable: true,
            sortField: 'email',
        },
        {
            name: 'Role',
            selector: (row: { role: any; }) => row?.role.name || '',
        },
        {
            name: 'Last Login',
            selector: (row: { lastLoginAt: string; }) => formatDateTime(row?.lastLoginAt) || '',
            grow: 2,
            right: true,
            sortable: true,
            sortField: 'lastLoginAt',
        },
        {
            name: '',
            right: true,
            maxWidth: '5px',
            cell: (row: any) => (
                <ActionGroup
                    options={[
                        { label: 'Edit', icon: 'edit', action: () => openEdit(row) },
                        { label: 'Delete', icon: 'trash', action: () => handleDelete(row) },
                    ]}
                />
            ),
        },
    ];

    const openCreate = () => {
        setIsCreate(true);
    }

    const closeCreate = () => {
        setIsCreate(false);
    }

    const openEdit = (user: any) => {
        setSelectedUser(user);
        setIsEdit(true);
    };

    const closeEdit = () => {
        setIsEdit(false);
        setSelectedUser(null);
    }

    const handleDelete = (user: any) => {
        setSelectedUser(user);
        setIsDelete(true);
    };

    const closeDelete = () => {
        setIsDelete(false);
        setSelectedUser(null);
    }

    const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
        return (
          <div className="p-6 bg-gray-50 text-xs">
            <div className="grid grid-cols-2">
              <div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Username</span>
                  <span className="col-span-2">:&nbsp;{data.username || '-'}</span>
                </div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Phone</span>
                  <span className="col-span-2">:&nbsp;{data.phone || '-'}</span>
                </div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Loket</span>
                  <span className="col-span-2">:&nbsp;{data.counter?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Cabang</span>
                  <span className="col-span-2">:&nbsp;{data.branch?.name || '-'}</span>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Active</span>
                  <span className="col-span-2">:&nbsp;{data.active ? 'Ya' : 'Tidak'}</span>
                </div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Dibuat Tanggal</span>
                  <span className="col-span-2">:&nbsp;{formatDateTime(data.createdAt)}</span>
                </div>
                <div className="grid grid-cols-3 max-w-sm mb-1">
                  <span>Diperbarui Tanggal</span>
                  <span className="col-span-2">:&nbsp;{formatDateTime(data.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      };

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2">Users</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={openCreate} />
                        <ExportCSV data={data} filename="users.csv" />
                    </div>
                </div>
                <div className="grid grid-cols-7 py-4 px-6 gap-3">
                    <div className="grid col-span-4">
                        <label className="text-xs mb-1">Search</label>
                        <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Cari berdasarkan id, nama dan email pengguna..." />
                    </div>
                    <div className="grid col-span-2">
                        <label className="text-xs mb-1">Role</label>
                        <select className="border border-gray-300 w-full text-sm py-1 px-2 rounded" value={roleField} onChange={handleRoleChanged}>
                            <option value="">All</option>
                            {roles.length && roles.map((role: any) => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid text-xs items-end justify-end">
                        <button className="border border-gray-300 flex items-center gap-1 py-2 px-4 rounded hover:bg-gray-50" onClick={handleResetFilter}>
                            <FaRotateLeft className="w-3 h-3" />
                            Reset
                        </button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    progressComponent={<CustomLoader />}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    onSort={handleSort}
                    sortServer
                />
            </div>

            {isCreate && (
                <UserCreate
                    isOpen={isCreate}
                    onClose={() => closeCreate()}
                />
            )}

            {isDelete && (
                <UserDelete
                    isOpen={isDelete}
                    onClose={() => closeDelete()}
                    data={selectedUser}
                />
            )}

            {selectedUser && (
                <UserEdit
                    isOpen={isEdit}
                    onClose={() => closeEdit()}
                    data={selectedUser}
                />
            )}
        </div>
    );
};

export default UserList;
