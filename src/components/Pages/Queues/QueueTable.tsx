"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import CustomLoader from "../../Tables/CustomLoader";
import Select from "@/components/Forms/Select";
import { FaSearch } from "react-icons/fa";
import TextInput from "@/components/Forms/TextInput";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import { useSession } from "next-auth/react";

const QueueTable: React.FC = () => {
  const { data: session, status } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const today = new Date().toISOString().split("T")[0];
  const [typeField, setTypeField] = useState("");
  const [statusField, setStatusField] = useState("");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  

  const branchId = (session?.user as any)?.branch?.id?.toString() || "";
  const branchType = (session?.user as any)?.branch?.type?.toString() || "";

  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    const loadRegions = async () => {
      setRegion('');
      setArea('');

      try {
        const response = await fetch(`/api/branches?type=REGION&size=100`);
        const result = await response.json();

        if (result.success) {
          setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    loadRegions();
  }, []);

  useEffect(() => {
    const loadAreas = async () => {
      setArea('');

      try {
        const response = await fetch(`/api/branches?type=AREA&aa=${region}`);
        const result = await response.json();

        if (result.success) {
          setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
        }
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    };

    if (region) {
      loadAreas();
    }
  }, [region]);

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
        const start = fromDate;
        const end = toDate;
        const size = perPage.toString();
        const page = (currentPage - 1).toString();
        const sortBy = sortField ? sortField : "createdAt";
        const direction = sortDirection.toString() || "DESC";
        const status = statusField.toString();
        const search = debouncedSearch;
        const type = typeField;
        const areaId = area;
        const aa = region;

        const queryParams = new URLSearchParams({
          start,
          end,
          size,
          page,
          sortBy,
          direction,
          type,
          areaId,
          aa,
          status,
          search,
        });

        if (branchId) {
          queryParams.append("branchId", branchId);
        }

        const response = await fetch(`/api/antrian?${queryParams.toString()}`);
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
  }, [fromDate, toDate, perPage, currentPage, sortField, sortDirection, statusField, debouncedSearch, typeField, region, area, branchId]);

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

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const filename = `queues-${formattedDate}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  const Export: React.FC<{ onExport: () => void }> = ({ onExport }) => (
    <button
      className="text-sm py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700 mr-2"
      onClick={() => onExport()}
    >
      Unduh CSV
    </button>
  );

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => (
    <div className="py-4 px-16 bg-gray-50 text-sm">
      <div className="grid grid-cols-2">
        <div>
          {/** Semua label diubah ke bahasa Indonesia */}
          <InfoRow label="Loket" value={`${data.counterName || ''} #${data.counterNum}`} />
          <InfoRow label="Petugas" value={data.userName} />
          <InfoRow label="Cabang" value={data.branchName} />
          <InfoRow label="Area" value={data.areaName} />
          <InfoRow label="Region" value={data.regionName} />
          <InfoRow label="Tipe Reservasi" value={data.type} />
          <InfoRow label="Waktu Reservasi" value={formatDateTime(data.createdAt)} />
          <InfoRow label="Waktu Dipanggil" value={formatDateTime(data.calledAt)} />
          <InfoRow label="Waktu Dilayani" value={formatDateTime(data.startedAt)} />
          <InfoRow label="Waktu Dijeda" value={formatDateTime(data.pausedAt)} />
          <InfoRow label="Waktu Dilanjutkan" value={formatDateTime(data.continuedAt)} />
          <InfoRow label="Waktu Dibatalkan" value={formatDateTime(data.canceledAt)} />
          <InfoRow label="Waktu Ditransfer" value={formatDateTime(data.transferredAt)} />
        </div>
        <div>
          <InfoRow label="Prioritas" value={data.priority ? 'Ya' : 'Tidak'} />
          <InfoRow label="Durasi SLA Minimum" value={`${data.slaMinDuration || 0} menit`} />
          <InfoRow label="Durasi SLA Maksimum" value={`${data.slaMaxDuration || 0} menit`} />
          <InfoRow label="Waktu Menunggu" value={`${(data.waitingDuration / 60).toFixed(0)} menit`} />
          <InfoRow label="Waktu Layanan" value={`${(data.serviceDuration / 60).toFixed(0)} menit`} />
          <InfoRow label="Durasi Jeda" value={`${(data.pauseDuration / 60).toFixed(0)} menit`} />
          <InfoRow label="Total Durasi" value={`${(data.overallDuration / 60).toFixed(0)} menit`} />
          <InfoRow label="Pesan Status" value={data.statusMessage} />
        </div>
      </div>
    </div>
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
    setFromDate(today);
    setToDate(today);
    setStatusField("");
    setTypeField("");
    setSearch("");
  }

  function formatDateTime(date: string) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID');
  }

  function statusWithStyle(status: string) {
    if (!status) return '';

    let style = 'py-1 px-2 rounded text-xs font-medium ';
    let message = '';

    switch (status) {
      case 'WAITING':
        style += 'bg-yellow-100 text-yellow-700';
        message = 'Waiting';
        break;
      case 'STARTED':
        style += 'bg-blue-100 text-blue-700';
        message = 'Served';
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
        message = 'Completed';
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

    if (serviceDuration > slaMaxDuration) {
      return 'Exceeds SLA';
    } else if (serviceDuration < slaMinDuration) {
      return 'SLA Met';
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
        <div>
          <div>{row.branchName}</div>
          <div className="text-sm text-gray-500 mt-1">{row.branchCode}</div>
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
    },
    {
      name: 'Jenis Layanan',
      selector: (row: { serviceTypeName: string; }) => row?.serviceTypeName || '',
      grow: 2,
      sortable: true,
      sortField: 'serviceTypeName',
    },
    {
      name: 'No Antrian',
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
      name: 'Kriteria SLA',
      selector: (row: { status: string; }) => slaCriteria(row) || '',
      grow: 2,
      sortable: true,
      sortField: 'status',
    },
  ];

  const isCompleted = (status: string) => {
    return status === 'STOPPED' || status === 'TRANSFERRED';
  }

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Data Antrian</h2>
          <div>
            <Export onExport={() => downloadCSV(data)} />
          </div>
        </div>

        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Pencarian"
              placeholder="Cari berdasarkan kode reservasi, no antrian, layanan atau cabang..."
              value={search}
              size="xs"
              onChange={(value) => setSearch(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid col-span-2">
            <Select
              size="xs"
              label="Tipe Reservasi"
              options={[
                { value: 'ONSITE', label: 'Langsung' },
                { value: 'ONLINE', label: 'Online' },
              ]}
              value={typeField}
              onChange={(value) => setTypeField(value as string)}
            />
          </div>
          <div className="grid text-sm items-end justify-end">
            <button
              className="flex items-center gap-2 py-2 px-4 border rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 border-gray-300 transition-colors"
              onClick={handleResetFilter}
            >
              <FaRotateLeft className="w-3 h-3" />
              Atur Ulang
            </button>
          </div>

          <div className="grid col-span-2">
            <DateTimePicker
              label="Tanggal Awal"
              value={fromDate}
              onChange={(value) => setFromDate(value)}
              size="xs"
              disableTime
            />
          </div>
          <div className="grid col-span-2">
            <DateTimePicker
              label="Tanggal Akhir"
              value={toDate}
              onChange={(value) => setToDate(value)}
              size="xs"
              disableTime
            />
          </div>
          <div className="grid col-span-2">
            <Select
              size="xs"
              label="Status Antrian"
              options={[
                { value: '', label: 'Semua' },
                { value: 'WAITING', label: 'Menunggu' },
                { value: 'STARTED,PAUSED,CONTINUED', label: 'Sedang Dilayani' },
                { value: 'STOPPED,CANCELED,TRANSFERRED', label: 'Selesai' },
              ]}
              value={statusField}
              onChange={(value) => setStatusField(value as string)}
            />
          </div>

          {branchType !== 'BRANCH' && (
            <>
              <div className="grid col-span-2">
                <Select size="xs" label="Region" options={regionOptions} value={region} onChange={(value) => setRegion(value as string)} />
              </div>
              <div className="grid col-span-2">
                <Select size="xs" label="Area" options={areaOptions} value={area} onChange={(value) => setArea(value as string)} disabled={region === ''} />
              </div>
            </>
          )}
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

// Komponen kecil untuk mempercantik InfoRow
const InfoRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="grid grid-cols-3 max-w-sm mb-1">
    <span className="font-medium">{label}</span>
    <span className="col-span-2">:&nbsp;{value || '-'}</span>
  </div>
);

export default QueueTable;
