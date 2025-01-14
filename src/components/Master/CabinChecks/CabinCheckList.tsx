"use client";

import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import CabinCheckCreate from "./CabinCheckCreate";
import CabinCheckDelete from "./CabinCheckDelete";
import CabinCheckEdit from "./CabinCheckEdit";

const CabinCheckList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

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
                const search = debouncedSearch;

                const response = await fetch(
                    `/api/master/cabin-checks`
                );

                const result = await response.json();

                if (result.success) {
                    setData(result.data);
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
    }, [debouncedSearch, isEdit, isCreate, isDelete]);

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

    const handleResetFilter = () => {
        setSearch("");
    };

    function formatDateTime(date: string) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID');
    }

    const columns = [
        {
            name: 'Activity',
            selector: (row: { activityName: string; }) => row?.activityName || '',
            grow: 3,
            sortable: true,
            sortField: 'activityName',
        },
        {
            name: 'Type',
            selector: (row: { activityType: string; }) => row?.activityType || '',
            center: true,
            sortable: true,
            sortField: 'activityType',
        },
        {
            name: 'Mandatory',
            selector: (row: { mandatory: boolean; }) => row?.mandatory === true ? 'Yes' : 'No',
            center: true,
            sortable: true,
            sortField: 'mandatory',
        },
        {
            name: 'Active',
            selector: (row: { active: boolean; }) => row?.active === true ? 'Yes' : 'No',
            center: true,
            sortable: true,
            sortField: 'active',
        },
        {
            name: 'Update Terakhir',
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
                        { label: 'Ubah', icon: 'edit', action: () => openEdit(row) },
                        { label: 'Hapus', icon: 'trash', action: () => handleDelete(row) },
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

    const openEdit = (row: any) => {
        setSelectedRow(row);
        setIsEdit(true);
    };

    const closeEdit = () => {
        setIsEdit(false);
        setSelectedRow(null);
    }

    const handleDelete = (row: any) => {
        setSelectedRow(row);
        setIsDelete(true);
    };

    const closeDelete = () => {
        setIsDelete(false);
        setSelectedRow(null);
    }

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2">Cabin Checks</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={openCreate} />
                        <Export onExport={() => downloadCSV(data)} />
                    </div>
                </div>
                <div className="grid grid-cols-7 py-4 px-6 gap-3">
                    <div className="grid col-span-4">
                        <label className="text-xs mb-1">Search</label>
                        <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Search by activity name..." />
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
                />
            </div>

            {isCreate && (
                <CabinCheckCreate
                    isOpen={isCreate}
                    onClose={() => closeCreate()}
                />
            )}

            {isDelete && (
                <CabinCheckDelete
                    isOpen={isDelete}
                    onClose={() => closeDelete()}
                    data={selectedRow}
                />
            )}

            {isEdit && (
                <CabinCheckEdit
                    isOpen={isEdit}
                    onClose={() => closeEdit()}
                    data={selectedRow}
                />
            )}
        </div>
    );
};

export default CabinCheckList;
