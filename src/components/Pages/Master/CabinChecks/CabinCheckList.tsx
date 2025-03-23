"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import CabinCheckCreate from "./CabinCheckCreate";
import CabinCheckDelete from "./CabinCheckDelete";
import CabinCheckEdit from "./CabinCheckEdit";
import ExportCSV from "@/components/Button/ExportCsvButton";
import TextInput from "@/components/Forms/TextInput";
import { FaRotateLeft } from "react-icons/fa6";
import ResetButton from "@/components/Button/ResetButton";

const CabinCheckList: React.FC = () => {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

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
        const response = await fetch(`/api/master/cabin-checks`);
        const result = await response.json();

        if (result.success) {
          setOriginalData(result.data);
          setFilteredData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isEdit && !isCreate && !isDelete) {
      fetchData();
    }
  }, [isEdit, isCreate, isDelete]);

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredData(originalData);
      return;
    }

    const filtered = originalData.filter((item) =>
      item.activityName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.activityType.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    setFilteredData(filtered);
  }, [debouncedSearch, originalData]);

  const handleResetFilter = () => {
    setSearch("");
    setFilteredData(originalData);
  };

  const columns = [
    {
      name: "Activity",
      selector: (row: { activityName: string }) => row?.activityName || "",
      grow: 3,
      sortable: true,
      sortField: "activityName",
    },
    {
      name: "Type",
      selector: (row: { activityType: string }) => row?.activityType || "",
      center: true,
      sortable: true,
      sortField: "activityType",
    },
    {
      name: "Mandatory",
      selector: (row: { mandatory: boolean }) =>
        row?.mandatory === true ? "Yes" : "No",
      center: true,
      sortable: true,
      sortField: "mandatory",
    },
    {
      name: "Active",
      selector: (row: { active: boolean }) =>
        row?.active === true ? "Yes" : "No",
      center: true,
      sortable: true,
      sortField: "active",
    },
    {
      name: "Last Updated",
      selector: (row: { updatedAt: string }) =>
        new Date(row.updatedAt).toLocaleString("id-ID") || "",
      sortable: true,
      sortField: "updatedAt",
      grow: 2,
      right: "true",
    },
    {
      name: "",
      right: "true",
      cell: (row: any) => (
        <ActionGroup
          options={[
            { label: "Edit", icon: "edit", action: () => openEdit(row) },
            { label: "Delete", icon: "trash", action: () => handleDelete(row) },
          ]}
        />
      ),
    },
  ];

  const openCreate = () => {
    setIsCreate(true);
  };

  const closeCreate = () => {
    setIsCreate(false);
  };

  const openEdit = (row: any) => {
    setSelectedRow(row);
    setIsEdit(true);
  };

  const closeEdit = () => {
    setIsEdit(false);
    setSelectedRow(null);
  };

  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setIsDelete(true);
  };

  const closeDelete = () => {
    setIsDelete(false);
    setSelectedRow(null);
  };

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Cabin Checks</h2>
          <div className="flex gap-2">
            <CreateButton onClick={openCreate} />
            <ExportCSV data={filteredData} filename="cabin-checks.csv" />
          </div>
        </div>
        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Search"
              placeholder="Search by activity name..."
              value={search}
              size="xs"
              onChange={(value) => setSearch(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid text-sm items-end justify-end col-span-3">
            <ResetButton onClick={handleResetFilter} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          progressComponent={<CustomLoader />}
          pagination
        />
      </div>

      {isCreate && <CabinCheckCreate isOpen={isCreate} onClose={closeCreate} />}
      {isDelete && (
        <CabinCheckDelete
          isOpen={isDelete}
          onClose={closeDelete}
          data={selectedRow}
        />
      )}
      {isEdit && (
        <CabinCheckEdit
          isOpen={isEdit}
          onClose={closeEdit}
          data={selectedRow}
        />
      )}
    </div>
  );
};

export default CabinCheckList;
