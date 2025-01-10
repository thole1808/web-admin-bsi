"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import styled, { keyframes } from 'styled-components';
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import CustomLoader from "../Tables/CustomLoader";

const Antrian: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const today = new Date().toISOString().split("T")[0];
  const [typeField, setTypeField] = useState("");
  const [statusField, setStatusField] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

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

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeField(event.target.value);
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === 'waiting') {
      setStatusField('WAITING');
    } else if (value === 'serving') {
      setStatusField('STARTED,PAUSED,CONTINUED');
    } else if (value === 'done') {
      setStatusField('STOPPED,CANCELED,TRANSFERRED');
    }
  }

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const start = fromDate;
        const end = toDate;
        const size = perPage.toString();
        const page = (currentPage - 1).toString();
        const sortBy = sortField ? sortField : "id";
        const direction = sortDirection.toString();
        const status = statusField.toString();
        const search = debouncedSearch;
        const type = typeField;
  
        const queryParams = new URLSearchParams({
          start,
          end,
          size,
          page,
          sortBy,
          direction,
          type,
          status,
          search
        });
  
        const response = await fetch(
          `/api/antrian?${queryParams.toString()}`
        );
  
        const result = await response.json();
  
        if (result.success) {
          setData(result.data.content);
          setTotalRows(result.data.totalElements);
        } else {
          throw new Error(result.message || "Failed to fetch queues");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueues();
  }, [fromDate, toDate, perPage, currentPage, sortField, sortDirection, statusField, debouncedSearch, typeField]);


  function convertArrayOfObjectsToCSV(array: any[]) {
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
  }

  function downloadCSV(array: any) {
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
  }

  const Export: React.FC<{ onExport: () => void }> = ({ onExport }) => <button className="text-xs py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700 mr-2" onClick={() => onExport()}>Download CSV</button>;

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <div className="p-6 bg-gray-50 text-xs">
        <div className="grid grid-cols-2">
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Loket</span>
              <span className="col-span-2">:&nbsp;{data.counterName || ''} #{data.counterNum}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Nama Petugas</span>
              <span className="col-span-2">:&nbsp;{data.userName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Reservasi</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.createdAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Dipanggil</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.calledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Layanan Dimulai</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.startedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Dijeda</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.pausedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Dilanjutkan</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.continuedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Dibatalkan</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.canceledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Pukul Ditransfer</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.transferredAt)}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Prioritas</span>
              <span className="col-span-2">:&nbsp;{data.priority ? 'Ya' : 'Tidak'}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Durasi SLA Min.</span>
              <span className="col-span-2">:&nbsp;{data.slaMinDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Durasi SLA Maks.</span>
              <span className="col-span-2">:&nbsp;{data.slaMaxDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Durasi Tunggu</span>
              <span className="col-span-2">:&nbsp;{(data.waitingDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Durasi Pelayanan</span>
              <span className="col-span-2">:&nbsp;{(data.serviceDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Durasi Jeda</span>
              <span className="col-span-2">:&nbsp;{(data.pauseDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Total Durasi</span>
              <span className="col-span-2">:&nbsp;{(data.overallDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span>Keterangan</span>
              <span className="col-span-2">:&nbsp;{data.statusMessage || ''}</span>
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
    setFromDate(today);
    setToDate(today);
    setStatusField("");
    setTypeField("");
  }

  function formatDateTime(date: string) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID');
  }

  function statusWithStyle(status: string) {
    if (!status) return '';

    let style = 'p-1 rounded text-xs font-medium ';
    let message = '';

    switch (status) {
      case 'WAITING':
        style += 'bg-yellow-100 text-yellow-700';
        message = 'Menunggu';
        break;
      case 'STARTED':
        style += 'bg-blue-100 text-blue-700';
        message = 'Dilayani';
        break;
      case 'PAUSED':
        style += 'bg-yellow-100 text-yellow-700';
        message = 'Dijeda';
        break;
      case 'CONTINUED':
        style += 'bg-blue-100 text-blue-700';
        message = 'Dilanjutkan';
        break;
      case 'STOPPED':
        style += 'bg-green-100 text-green-700';
        message = 'Selesai';
        break;
      case 'CANCELED':
        style += 'bg-red-100 text-red-700';
        message = 'Dibatalkan';
        break;
      case 'TRANSFERRED':
        style += 'bg-purple-100 text-purple-700';
        message = 'Ditransfer';
        break;
    }

    return (<div className={style}>{message}</div>);
  }

  function slaCriteria(row: any) {
    const slaMinDuration = row.slaMinDuration;
    const slaMaxDuration = row.slaMaxDuration;
    let serviceDuration = row.serviceDuration;

    if (!serviceDuration) {
      return '-';
    }

    serviceDuration = serviceDuration / 60;

    if (serviceDuration >= slaMinDuration && serviceDuration <= slaMaxDuration) {
      return 'SLA Terpenuhi';
    } else if (serviceDuration > slaMaxDuration) {
      return 'Melebihi SLA';
    } else if (serviceDuration < slaMinDuration) {
      return 'Kurang dari SLA';
    }
  }

  const columns = [
    {
      name: 'Cabang',
      selector: (row: { branchName: any; }) => row.branchName || '',
      grow: 2,
      sortable: true,
      sortField: 'branchName',
      cell: (row: { branchName: string; branchCode: string; }) => (
        <div className="">
          <div>{row.branchName}</div>
          <div className="text-xs text-gray-500 mt-1">{row.branchCode}</div>
        </div>
      ),
    },
    {
      name: 'Tanggal',
      selector: (row: { createdAt: string; }) => formatDateTime(row?.createdAt) || '',
      grow: 2,
      sortable: true,
      sortField: 'createdAt',
    },
    {
      name: 'Kode Reservasi',
      selector: (row: { reservationCode: string; }) => row?.reservationCode || '',
      grow: 2,
      sortable: true,
      sortField: 'reservationCode',
      cell: (row: { reservationCode: string; type: string; }) => (
        <div className="">
          <div>{row.reservationCode}</div>
          <div className="text-xs text-gray-500 mt-1">{row.type}</div>
        </div>
      ),
    },
    {
      name: 'Jenis Layanan',
      selector: (row: { serviceTypeName: string; }) => row?.serviceTypeName || '',
      grow: 2,
      sortable: true,
      sortField: 'serviceTypeName',
    },
    {
      name: 'No. Antrian',
      selector: (row: { displayNo: string; }) => row?.displayNo || '',
      sortable: true,
      sortField: 'displayNo',
    },
    {
      name: 'Petugas',
      selector: (row: { userName: string; }) => row?.userName || '',
      sortable: true,
      sortField: 'userName',
    },
    {
      name: 'Status',
      selector: (row: { status: string; }) => row?.status || '',
      grow: 2,
      sortable: true,
      sortField: 'status',
      cell: (row: { status: string; }) => statusWithStyle(row.status),
    },
    {
      name: 'Performa SLA',
      selector: (row: { status: string; }) => slaCriteria(row) || '',
      grow: 2,
      sortable: true,
      sortField: 'status',
      conditionalCellStyles: [
        {
          when: (row: { serviceDuration: number; slaMinDuration: number; status: string }) => isCompleted(row.status) && row.serviceDuration / 60 < row.slaMinDuration,
          style: {
            backgroundColor: '#f6d45a',
            color: 'black',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
        {
          when: (row: { serviceDuration: number; slaMinDuration: number; slaMaxDuration: number; status: string }) => isCompleted(row.status) && row.serviceDuration / 60 >= row.slaMinDuration && row.serviceDuration / 60 <= row.slaMaxDuration,
          style: {
            backgroundColor: '#3daea4',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
        {
          when: (row: { serviceDuration: number; slaMaxDuration: number; status: string }) => isCompleted(row.status) && row.serviceDuration / 60 > row.slaMaxDuration,
          style: {
            backgroundColor: '#ed553b',
            color: 'white',
            '&:hover': {
              cursor: 'not-allowed',
            },
          },
        },
      ],
    },
  ];

  const isCompleted = (status: string) => {
    return status === 'STOPPED';
  }

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Antrian</h2>
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
            <label className="text-xs mb-1">Dari Tanggal</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="date" value={fromDate} onChange={handleFromDateChange} max={today} />
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">Ke Tanggal</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="date" value={toDate} onChange={handleToDateChange} max={today} />
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

export default Antrian;
