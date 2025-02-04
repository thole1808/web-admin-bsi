"use client";

import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import CreateRole from "./RoleCreate";
import DeleteRole from "./RoleDelete";
import EditRole from "./RoleEdit";
import ModalView from "@/components/Tables/ModalView";

const RoleList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string | null>('id');
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [isViewPermission, setIsViewPermission] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const size = perPage.toString();
                const page = (currentPage - 1).toString();
                const sortBy = sortField ? sortField : "id";
                const direction = sortDirection.toString();
                const search = debouncedSearch;

                const queryParams = new URLSearchParams({
                    size,
                    page,
                    sortBy,
                    direction,
                    search
                });

                const response = await fetch(
                    `/api/access/roles?${queryParams.toString()}`
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
    }, [debouncedSearch, isEdit, isCreate, isDelete, perPage, currentPage, sortField, sortDirection]);

    const convertArrayOfObjectsToCSV = (array: any[]) => {
        let result: string;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach((item: { [x: string]: any; }) => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    };

    const downloadCSV = (array: any) => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };

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
        setSearch("");
    };

    function formatDateTime(date: string) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID');
    }

    const columns = [
        {
            name: 'Code',
            selector: (row: { code: any; }) => row?.code || '-',
            sortable: true,
            sortField: 'code',
        },
        {
            name: 'Name',
            selector: (row: { name: any; }) => row?.name || '',
            grow: 3,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Guard',
            selector: (row: { guardName: any; }) => row?.guardName || '',
            grow: 3,
            sortable: true,
            sortField: 'guardName',
            cell: (row: { guardName: any; }) => (
                <span className="text-xs bg-gray-100 text-gray-500 py-1 px-2 rounded">{row.guardName === 'api' ? 'Caller' : 'Webadmin'}</span>
            ),
        },
        {
            name: 'Permissions',
            selector: (row: { permissions: any; }) => (row?.permissions?.length || '0') + ' item' || '',
            cell: (row: { permissions: any; }) => (
                <button onClick={() => viewPermissions(row?.permissions)} className={`${row?.permissions?.length > 0 ? 'text-blue-500' : ''} flex items-center gap-1`}>
                    <span>{row?.permissions?.length || '0'}</span>
                    <span className="text-xs">item</span>
                </button>
            ),
        },
        {
            name: 'Last Updated',
            selector: (row: { updatedAt: string; }) => formatDateTime(row?.updatedAt) || '',
            sortable: true,
            sortField: 'updatedAt',
            grow: 2,
            right: true,
        },
        {
            name: '',
            right: true,
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

    const viewPermissions = (permissions: any) => {
        setPermissions(permissions);
        setIsViewPermission(true);
    }

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

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2">Role</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={openCreate} />
                        <Export onExport={() => downloadCSV(data)} />
                    </div>
                </div>
                <div className="grid grid-cols-7 py-4 px-6 gap-3">
                    <div className="grid col-span-4">
                        <label className="text-xs mb-1">Search</label>
                        <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Cari berdasarkan id, nama dan email peran..." />
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
                <CreateRole
                    isOpen={isCreate}
                    onClose={() => closeCreate()}
                />
            )}

            {isDelete && (
                <DeleteRole
                    isOpen={isDelete}
                    onClose={() => closeDelete()}
                    data={selectedUser}
                />
            )}

            {selectedUser && (
                <EditRole
                    isOpen={isEdit}
                    onClose={() => closeEdit()}
                    data={selectedUser}
                />
            )}

            {isViewPermission && (
                <ModalView
                    width="lg"
                    title="View Permissions"
                    isOpen={isViewPermission}
                    onClose={() => { setIsViewPermission(false); setPermissions([]); }}
                >
                    {permissions.length === 0 ? (
                        <div className="text-center text-gray-500">No permissions found</div>
                    ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {permissions.map((permission: any) => (
                            <div key={permission.id} className="border border-gray-300 hover:bg-teal-400 hover:text-white rounded p-2 text-sm">
                                <div className="font-medium">{permission.name}</div>
                                <div className="text-xs">{permission.description}</div>
                            </div>
                        ))}
                    </div>
                    )}
                </ModalView>
            )}
        </div>
    );
};

export default RoleList;
