"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import CustomLoader from "../Tables/CustomLoader";
import ExportCSV from "../Button/ExportCsvButton";
import TextInput from "../Forms/TextInput";
import { FaCog, FaSearch } from "react-icons/fa";
import ResetButton from "../Button/ResetButton";
import Select from "../Forms/Select";
import Link from "next/link";

const BranchList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [typeField, setTypeField] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const size = perPage.toString();
        const page = (currentPage - 1).toString();
        const sortBy = sortField ? sortField : "id";
        const direction = sortDirection.toString();
        const search = debouncedSearch;
        const type = typeField;

        const queryParams = new URLSearchParams({
          size,
          page,
          sortBy,
          direction,
          type,
          search
        });

        const response = await fetch(
          `/api/branches?${queryParams.toString()}`
        );

        const result = await response.json();

        if (result.success) {
          setData(result.data.content);
          setTotalRows(result.data.totalElements);
        } else {
          throw new Error(result.message || "Failed to fetch queues");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, [perPage, currentPage, sortField, sortDirection, debouncedSearch, typeField]);

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <div className="py-4 px-16 bg-gray-50 text-xs">
        <div className="grid grid-cols-2">
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Area</span>
              <span className="col-span-2">:&nbsp;{data.areaName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Region</span>
              <span className="col-span-2">:&nbsp;{data.regionName}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Address</span>
              <span className="col-span-2">:&nbsp;{data.address || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Phone</span>
              <span className="col-span-2">:&nbsp;{data.phone || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Timezone</span>
              <span className="col-span-2">:&nbsp;{data.timezone || ''}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Is Active</span>
              <span className="col-span-2">:&nbsp;{data.active ? 'Yes' : 'No'}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Created at</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.createdAt) || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Updated at</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.updatedAt) || ''}</span>
            </div>
          </div>
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
    setTypeField("");
    setSearch("");
  }

  function formatDateTime(date: string) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID');
  }

  function typeWithStyle(type: string) {
    if (!type) return '';

    let style = 'p-1 rounded text-xs font-medium ';

    switch (type) {
      case 'BRANCH':
        style += 'bg-yellow-100 text-yellow-700';
        break;
      case 'AREA':
        style += 'bg-blue-100 text-blue-700';
        break;
      case 'REGION':
        style += 'bg-green-100 text-green-700';
        break;
    }

    return (<div className={style}>{type}</div>);
  }

  const columns = [
    {
      name: 'Code',
      selector: (row: { code: string; }) => row.code || '',
      sortable: true,
      sortField: 'code',
    },
    {
      name: 'Name',
      selector: (row: { name: string; }) => row.name || '',
      grow: 2,
      sortable: true,
      sortField: 'name',
    },
    {
      name: 'Type',
      selector: (row: { type: string; }) => row.type || '',
      sortable: true,
      sortField: 'type',
      cell: (row: { type: string; }) => typeWithStyle(row.type),
    },
    {
      name: 'Unit',
      selector: (row: { unit: string; }) => row.unit || '',
      sortable: true,
      sortField: 'unit',
    },
    {
      name: 'Room Capacity',
      selector: (row: { maxRoomCapacity: number; }) => row.maxRoomCapacity || '',
      sortable: true,
      sortField: 'maxRoomCapacity',
    },
    {
      name: 'Queue Quota',
      selector: (row: { maxQueueCapacity: number; }) => row.maxQueueCapacity || '',
      sortable: true,
      sortField: 'maxQueueCapacity',
    },
    {
      name: 'Last Updated',
      selector: (row: { updatedAt: string; }) => formatDateTime(row?.updatedAt) || '',
      right: true,
      grow: 2,
      sortable: true,
      sortField: 'updatedAt',
    },
    {
      name: "",
      right: true,
      cell: (row: any) => (
        <Link href={`/branches/${row.id}`} className="text-xs border font-medium rounded bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-2 flex gap-1 items-center">
          Manage <FaCog className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Queues</h2>
          <div>
            <ExportCSV data={data} filename="branches.csv" />
          </div>
        </div>
        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Search"
              placeholder="Search by status or message..."
              value={search}
              size="xs"
              onChange={(value) => setSearch(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid col-span-2">
            <Select
              label="Type"
              options={[
                { value: '', label: 'All' },
                { value: 'REGION', label: 'Region' },
                { value: 'AREA', label: 'Area' },
                { value: 'BRANCH', label: 'Branch' },
              ]}
              size="xs"
              value={typeField}
              onChange={(value) => setTypeField(value.toString())}
              placeholder="Select an option"
            />
          </div>
          <div className="grid text-xs items-end justify-end col-span-1">
            <ResetButton onClick={handleResetFilter} />
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

export default BranchList;
