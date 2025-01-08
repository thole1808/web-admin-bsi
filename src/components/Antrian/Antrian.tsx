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

  useEffect(() => {
    fetchQueues();
  }, [perPage, currentPage, sortField, sortDirection]);

  const fetchQueues = async () => {
    try {
      const today = new Date();
      const timezoneOffset = today.getTimezoneOffset() * 60000;
      const localTime = new Date(today.getTime() - timezoneOffset);

      const start = localTime.toISOString().split("T")[0] + "T00:00:00";
      const end = localTime.toISOString().split("T")[0] + "T23:59:59";
      const size = perPage.toString();
      const page = (currentPage - 1).toString();
      const sortBy = sortField ? sortField : "id";
      const direction = sortDirection.toString();

      const queryParams = new URLSearchParams({
        start,
        end,
        size,
        page,
        sortBy,
        direction
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
      selector: (row: { branchName: string; }) => row.branchName,
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
      selector: (row: { reservationCode: string; }) => row.reservationCode,
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
      selector: (row: { createdAt: string; }) => formatDateTime(row.createdAt),
      grow: 2,
      sortable: true,
      sortField: 'createdAt',
    },
    {
      name: 'Jenis Layanan',
      selector: (row: { serviceTypeName: string; }) => row.serviceTypeName,
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
      selector: (row: { displayNo: string; }) => row.displayNo,
      sortable: true,
      sortField: 'displayNo',
    },
    {
      name: 'Petugas',
      selector: (row: { counterName: string; }) => row.counterName,
      sortable: true,
      sortField: 'counterName',
    },
    {
      name: 'Status',
      selector: (row: { status: string; }) => row.status,
      sortable: true,
      sortField: 'status',
    },
  ];

  return (
    <div className="py-1 border rounded-lg bg-white">
      <DataTable
        title="Antrian"
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
      />
    </div>
  );
};

export default Antrian;
