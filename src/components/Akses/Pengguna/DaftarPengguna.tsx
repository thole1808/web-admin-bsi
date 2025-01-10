"use client";

import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";


const DaftarPengguna: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [typeField, setTypeField] = useState("");
  const [statusField, setStatusField] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeField(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === 'waiting') {
      setStatusField('WAITING');
    } else if (value === 'serving') {
      setStatusField('STARTED,PAUSED,CONTINUED');
    } else if (value === 'done') {
      setStatusField('STOPPED,CANCELED,TRANSFERRED');
    }
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
        const type = typeField;
  
        const queryParams = new URLSearchParams({
          size,
          page,
          sortBy,
          direction,
          type,
          status,
          search
        });
  
        const response = await fetch(
          `/api/akses/pengguna?${queryParams.toString()}`
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

    fetchData();
  }, [perPage, currentPage, sortField, sortDirection, statusField, debouncedSearch, typeField]);

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
    setStatusField("");
    setTypeField("");
  };

  function formatDateTime(date: string) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID');
  }

  const columns = [
    {
      name: 'ID Pengguna',
      selector: (row: { officialId: any; }) => row.officialId || '-',
      sortable: true,
      sortField: 'officialId',
    },
    {
      name: 'Nama Pengguna',
      selector: (row: { name: any; }) => row.name || '',
      sortable: true,
      sortField: 'name',
    },
    {
      name: 'Email',
      selector: (row: { email: any; }) => row.email || '',
      sortable: true,
      sortField: 'email',
    },
    {
      name: 'Peran',
      selector: (row: { role: any; }) => row.role.name || '',
    },
    {
      name: 'Login Terakhir',
      selector: (row: { lastLoginAt: string; }) => formatDateTime(row?.lastLoginAt) || '',
      grow: 2,
      sortable: true,
      sortField: 'lastLoginAt',
    },
    {
      name: '',
      cell: (row: any) => <ActionGroup options={actions(row)} />,
    },
  ];

  const actions = (row: any) => [
    {
      label: 'Lihat Detail',
      action: () => {
        console.log('Lihat Detail', row);
      },
    },
    {
      label: 'Ubah',
      action: () => {
        console.log('Ubah', row);
      },
    },
    {
      label: 'Hapus',
      action: () => {
        console.log('Hapus', row);
      },
    },
  ];

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Pengguna</h2>
          <div>
            <Export onExport={() => downloadCSV(data)} />
          </div>
        </div>
        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <label className="text-xs mb-1">Pencarian</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Cari berdasarkan kode reservasi, no. antrian, jenis layanan, dan nama cabang..." />
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">Jenis Reservasi</label>
            <select className="border border-gray-300 w-full text-sm py-1 px-2 rounded" value={typeField} onChange={handleTypeChange}>
              <option value="">Semua</option>
              <option value="ONLINE">Online</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>
          <div className="grid text-xs items-end justify-end">
            <button className="border border-gray-300 flex items-center gap-1 py-2 px-4 rounded hover:bg-gray-50" onClick={handleResetFilter}>
              <FaRotateLeft className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">Status</label>
            <select className="border border-gray-300 w-full text-sm py-1 px-2 rounded" value={statusField} onChange={handleStatusChange}>
              <option value="">Semua</option>
              <option value="waiting">Menunggu</option>
              <option value="serving">Dilayani</option>
              <option value="done">Selesai</option>
            </select>
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
    </div>
  );
};

export default DaftarPengguna;
