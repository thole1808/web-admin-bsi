"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';

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
  const [statusField, setStatusField] = useState("");

  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === 'waiting') {
      setStatusField('WAITING');
    } else if (value === 'serving') {
      setStatusField('STARTED,PAUSED,CONTINUED');
    } else if (value === 'done') {
      setStatusField('STOPPED,CANCELED,TRANSFERRED');
    } else {
      setStatusField(value);
    }
  }

  useEffect(() => {
    fetchQueues();
  }, [fromDate, toDate, perPage, currentPage, sortField, sortDirection, statusField]);

  const fetchQueues = async () => {
    try {
      const start = fromDate;
      const end = toDate;
      const size = perPage.toString();
      const page = (currentPage - 1).toString();
      const sortBy = sortField ? sortField : "id";
      const direction = sortDirection.toString();
      const status = statusField.toString()

      const queryParams = new URLSearchParams({
        start,
        end,
        size,
        page,
        sortBy,
        direction,
        status
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

  const Export: React.FC<{ onExport: () => void }> = ({ onExport }) => <button className="text-xs p-2 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg border text-gray-700 mr-2" onClick={() => onExport()}>Download</button>;

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <div className="p-4 bg-gray-50 text-xs">
        <div className="text-gray-500">Detail</div>
        <div className="grid grid-cols-2">
          <div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Reservasi</span>
              <span className="col-span-2">: {formatDateTime(data.createdAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Dipanggil</span>
              <span className="col-span-2">: {formatDateTime(data.calledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Layanan Dimulai</span>
              <span className="col-span-2">: {formatDateTime(data.startedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Dijeda</span>
              <span className="col-span-2">: {formatDateTime(data.pausedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Dilanjutkan</span>
              <span className="col-span-2">: {formatDateTime(data.continuedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Dibatalkan</span>
              <span className="col-span-2">: {formatDateTime(data.canceledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Pukul Ditransfer</span>
              <span className="col-span-2">: {formatDateTime(data.transferredAt)}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Durasi Tunggu</span>
              <span className="col-span-2">: {data.waitingDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Durasi Pelayanan</span>
              <span className="col-span-2">: {data.serviceDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Durasi Jeda</span>
              <span className="col-span-2">: {data.pauseDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm">
              <span>Total Durasi</span>
              <span className="col-span-2">: {data.overallDuration || 0} menit</span>
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

  function formatDateTime(date: string) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID');
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
      name: 'Tanggal',
      selector: (row: { createdAt: string; }) => formatDateTime(row?.createdAt) || '',
      grow: 2,
      sortable: true,
      sortField: 'createdAt',
    },
    {
      name: 'Jenis Layanan',
      selector: (row: { serviceTypeName: string; }) => row?.serviceTypeName || '',
      grow: 2,
      sortable: true,
      sortField: 'serviceTypeName',
      cell: (row: { serviceTypeName: string; slaMinDuration: number; slaMaxDuration: number }) => (
        <div className="">
          <div>{row.serviceTypeName}</div>
          <div className="text-xs text-gray-500 mt-1">SLA: {row.slaMinDuration + 'm - ' + row.slaMaxDuration + 'm'}</div>
        </div>
      ),
    },
    {
      name: 'No. Antrian',
      selector: (row: { displayNo: string; }) => row?.displayNo || '',
      sortable: true,
      sortField: 'displayNo',
    },
    {
      name: 'Petugas',
      selector: (row: { counterName: string; }) => row?.counterName || '',
      sortable: true,
      sortField: 'counterName',
    },
    {
      name: 'Status',
      selector: (row: { status: string; }) => row?.status || '',
      sortable: true,
      sortField: 'status',
    },
  ];

  return (
    <div className="grid gap-y-4">
      <div className="border rounded-lg bg-white grid grid-cols-7 p-4 gap-3">
        <div className="grid col-span-2">
          <label className="text-xs mb-1">Dari Tanggal</label>
          <input className="border w-full text-sm py-1 px-2 rounded" type="date" value={fromDate} onChange={handleFromDateChange} max={today} />
        </div>
        <div className="grid col-span-2">
          <label className="text-xs mb-1">Ke Tanggal</label>
          <input className="border w-full text-sm py-1 px-2 rounded" type="date" value={toDate} onChange={handleToDateChange} max={today} />
        </div>
        <div className="grid col-span-2">
          <label className="text-xs mb-1">Status</label>
          <select className="border w-full text-sm py-1 px-2 rounded" onChange={handleStatusChange}>
            <option value="">Semua</option>
            <option value="waiting">Menunggu</option>
            <option value="serving">Dilayani</option>
            <option value="done">Selesai</option>
          </select>
        </div>
      </div>
      <div className="py-1 border rounded-lg bg-white">
        <DataTable
          title="Daftar Antrian"
          columns={columns}
          data={data}
          progressPending={loading}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          actions={<Export onExport={() => downloadCSV(data)} />}
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
