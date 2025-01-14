"use client";

import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import NationalHolidayCreate from "./NationalHolidayCreate";
import NationalHolidayDelete from "./NationalHolidayDelete";
import NationalHolidayEdit from "./NationalHolidayEdit";
import ExportCSV from "@/components/Button/ExportCsvButton";

const NationalHolidayList: React.FC = () => {
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
                const response = await fetch(`/api/master/national-holidays`);
                const result = await response.json();
    
                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch national holidays");
                }
            } catch (err: any) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        if (isEdit || isCreate || isDelete) return;
    
        fetchData();
    }, [isEdit, isCreate, isDelete]);
    
    useEffect(() => {
        const filterData = () => {
            if (!debouncedSearch) {
                setData(data);
                return;
            }
    
            const filteredData = data.filter((item) =>
                item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                item.date.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
    
            setData(filteredData);
        };
    
        filterData();
    }, [debouncedSearch]);

    const handleResetFilter = () => {
        setSearch("");
    };

    function formatDateTime(date: string) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID');
    }

    const columns = [
        {
            name: 'Date',
            selector: (row: { date: string; }) => row?.date || '',
            sortable: true,
            sortField: 'date',
        },
        {
            name: 'Name',
            selector: (row: { name: string; }) => row?.name || '',
            grow: 3,
            sortable: true,
            sortField: 'name',
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
                    <h2 className="text-lg font-semibold ml-2">National Holiday</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={openCreate} />
                        <ExportCSV data={data} filename="national_holiday.csv" />
                    </div>
                </div>
                <div className="grid grid-cols-7 py-4 px-6 gap-3">
                    <div className="grid col-span-4">
                        <label className="text-xs mb-1">Search</label>
                        <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Search by activity name..." />
                    </div>
                    <div className="grid text-xs items-end justify-end col-span-3">
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
                <NationalHolidayCreate
                    isOpen={isCreate}
                    onClose={() => closeCreate()}
                />
            )}

            {isDelete && (
                <NationalHolidayDelete
                    isOpen={isDelete}
                    onClose={() => closeDelete()}
                    data={selectedRow}
                />
            )}

            {isEdit && (
                <NationalHolidayEdit
                    isOpen={isEdit}
                    onClose={() => closeEdit()}
                    data={selectedRow}
                />
            )}
        </div>
    );
};

export default NationalHolidayList;
