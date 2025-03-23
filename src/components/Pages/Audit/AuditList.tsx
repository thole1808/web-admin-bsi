"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import CustomLoader from "../../Tables/CustomLoader";
import ExportCSV from "../../Button/ExportCsvButton";
import TextInput from "../../Forms/TextInput";
import { FaCog, FaSearch } from "react-icons/fa";
import ResetButton from "../../Button/ResetButton";
import Select from "../../Forms/Select";
import Link from "next/link";
import DateTimePicker from "../../Forms/DateTimePicker";

const AuditList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [eventField, setEventField] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [toDate, setToDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

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
                const eventType = eventField;
                const startOfDay = fromDate;
                const endOfDay = toDate;

                const queryParams = new URLSearchParams({
                    size,
                    page,
                    sortBy,
                    direction,
                    eventType,
                    search,
                    startOfDay,
                    endOfDay
                });

                const response = await fetch(
                    `/api/audit?${queryParams.toString()}`
                );

                const result = await response.json();

                if (result.success) {
                    setData(result.data.content);
                    setTotalRows(result.data.totalElements);
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [perPage, currentPage, sortField, sortDirection, debouncedSearch, eventField, fromDate, toDate]);

    const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
        return (
            <div className="py-4 px-16 bg-gray-50 text-sm">
                <div className="grid grid-cols-10 mb-2">
                    <span className="font-medium">Old Value</span>
                    <span className="col-span-9">:&nbsp;{data.oldValue || '-'}</span>
                </div>
                <div className="grid grid-cols-10 mb-2">
                    <span className="font-medium">New Value</span>
                    <span className="col-span-9">:&nbsp;{data.newValue || '-'}</span>
                </div>
            </div>
        )
    };

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
        setEventField("");
        setSearch("");
    }

    function formatDateTime(date: string) {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID');
    }

    function eventWithStyle(event: string) {
        if (!event) return '';

        let style = 'p-1 rounded text-sm font-medium ';

        switch (event) {
            case 'CREATE':
                style += 'bg-green-100 text-green-700';
                break;
            case 'UPDATE':
                style += 'bg-orange-100 text-orange-700';
                break;
            case 'DELETE':
                style += 'bg-red-100 text-red-700';
                break;
        }

        return (<div className={style}>{event}</div>);
    }

    const columns = [
        {
            name: 'Datetime',
            selector: (row: { createdAt: string; }) => formatDateTime(row?.createdAt) || '',
        },
        {
            name: 'Username',
            selector: (row: { username: string; }) => row?.username || '',
            sortable: true,
            sortField: 'username',
        },
        {
            name: 'Event',
            selector: (row: { eventType: string; }) => row?.eventType || '',
            sortable: true,
            sortField: 'eventType',
            cell: (row: { eventType: string; }) => eventWithStyle(row?.eventType),
        },
        {
            name: 'Entity',
            selector: (row: { entity: string; }) => row?.entity || '',
            sortable: true,
            sortField: 'entity',
        },
    ];

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2">Audit Trails</h2>
                    <div>
                        <ExportCSV data={data} filename="audit-trails.csv" />
                    </div>
                </div>
                <div className="grid grid-cols-7 py-4 px-6 gap-3">
                    <div className="grid col-span-4">
                        <TextInput
                            label="Search"
                            placeholder="Search by username..."
                            value={search}
                            size="xs"
                            onChange={(value) => setSearch(value)}
                            suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
                        />
                    </div>
                    <div className="grid col-span-2">
                        <Select
                            label="Event"
                            options={[
                                { value: '', label: 'All' },
                                { value: 'CREATE', label: 'Create' },
                                { value: 'UPDATE', label: 'Update' },
                                { value: 'DELETE', label: 'Delete' },
                            ]}
                            size="xs"
                            value={eventField}
                            onChange={(value) => setEventField(value.toString())}
                            placeholder="Select an option"
                        />
                    </div>
                    <div className="grid text-sm items-end justify-end col-span-1">
                        <ResetButton onClick={handleResetFilter} />
                    </div>
                    <div className="grid col-span-2">
                        <DateTimePicker
                            label="From Date"
                            value={fromDate}
                            onChange={(value) => setFromDate(value)}
                            size="xs"
                            disableTime
                        />
                    </div>
                    <div className="grid col-span-2">
                        <DateTimePicker
                            label="To Date"
                            value={toDate}
                            onChange={(value) => setToDate(value)}
                            size="xs"
                            disableTime
                        />
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
        </div>
    );
};

export default AuditList;
