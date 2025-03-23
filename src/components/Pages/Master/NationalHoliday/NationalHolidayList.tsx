"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import NationalHolidayCreate from "./NationalHolidayCreate";
import NationalHolidayDelete from "./NationalHolidayDelete";
import NationalHolidayEdit from "./NationalHolidayEdit";
import ExportCSV from "@/components/Button/ExportCsvButton";
import TextInput from "@/components/Forms/TextInput";
import { FaRotateLeft } from "react-icons/fa6";
import ResetButton from "@/components/Button/ResetButton";

const NationalHolidayList: React.FC = () => {
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
        const response = await fetch(`/api/master/national-holidays`);
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
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.date.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    setFilteredData(filtered);
  }, [debouncedSearch, originalData]);

  const handleResetFilter = () => {
    setSearch("");
    setFilteredData(originalData);
  };

  const columns = [
    {
      name: "Date",
      selector: (row: { date: string }) => row?.date || "",
      sortable: true,
      sortField: "date",
    },
    {
      name: "Name",
      selector: (row: { name: string }) => row?.name || "",
      grow: 3,
      sortable: true,
      sortField: "name",
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
          <h2 className="text-lg font-semibold ml-2">National Holiday</h2>
          <div className="flex gap-2">
            <CreateButton onClick={openCreate} />
            <ExportCSV data={filteredData} filename="national-holidays.csv" />
          </div>
        </div>
        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Search"
              placeholder="Search by holiday name or date..."
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

      {isCreate && <NationalHolidayCreate isOpen={isCreate} onClose={closeCreate} />}
      {isDelete && (
        <NationalHolidayDelete
          isOpen={isDelete}
          onClose={closeDelete}
          data={selectedRow}
        />
      )}
      {isEdit && (
        <NationalHolidayEdit
          isOpen={isEdit}
          onClose={closeEdit}
          data={selectedRow}
        />
      )}
    </div>
  );
};

export default NationalHolidayList;
