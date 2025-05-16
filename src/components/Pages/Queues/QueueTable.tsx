"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import CustomLoader from "../../Tables/CustomLoader";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [branch, setBranch] = useState("");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [branchOptions, setBranchOptions] = useState<any[]>([]);


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
      setBranch('');

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
      setBranch('');
      setArea('');

      try {
        const response = await fetch(`/api/branches?type=AREA&regionId=${region}`);
        const result = await response.json();

        if (result.success) {
          setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
        }
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    };

    if (session?.user.branch?.type === 'REGION') {
      setRegion(session?.user.branch?.regionId || "");
    }

    if (region) {
      loadAreas();
    }
  }, [region, session]);

  useEffect(() => {
    const loadBranches = async () => {
      setBranch('');

      try {
        const response = await fetch(`/api/branches?type=BRANCH&areaId=${area}&regionId=${region}`);
        const result = await response.json();

        if (result.success) {
          setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
        }
      } catch (err) {
        console.error('Error fetching areas:', err);
      }
    };

    if (session?.user.branch?.type === 'AREA') {
      setRegion(session?.user.branch?.regionId || "");
      setArea(session?.user.branch?.areaId || "");
    }

    if (area) {
      loadBranches();
    }
  }, [session, area, region]);

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
        const type = typeField === "all" ? "" : typeField;
        const areaId = area === "all" ? "" : area;
        const regionId = region === "all" ? "" : region;
        const branchId = branch === "all" ? "" : branch;

        const queryParams = new URLSearchParams({
          start,
          end,
          size,
          page,
          sortBy,
          direction,
          type,
          areaId,
          regionId,
          branchId,
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
  }, [fromDate, toDate, perPage, currentPage, sortField, sortDirection, statusField, debouncedSearch, typeField, region, area, branchId, branch]);

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
          <InfoRow label="Jenis Reservasi" value={data.type} />
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
    <div className="grid gap-4">
      <Card className="shadow-md border">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <CardTitle className="text-lg font-semibold">Daftar Antrian</CardTitle>
          <Export onExport={() => downloadCSV(data)} />
        </CardHeader>

        <CardContent className="space-y-4 px-6 py-4">
          {/* Baris Filter */}
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tanggal Awal */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Tanggal Awal</Label>
              <DateTimePicker
                value={fromDate}
                onChange={setFromDate}
                disableTime
              />
            </div>

            {/* Tanggal Akhir */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Tanggal Akhir</Label>
              <DateTimePicker
                value={toDate}
                onChange={setToDate}
                disableTime
              />
            </div>

            {/* Tipe Reservasi */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-sm font-medium text-muted-foreground">Jenis Reservasi</Label>
              <Select value={typeField} onValueChange={setTypeField}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih Jenis Reservasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="ONSITE">Onsite</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Antrian */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-sm font-medium text-muted-foreground">Status Antrian</Label>
              <Select value={statusField} onValueChange={setStatusField}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih Status Antrian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="WAITING">Menunggu</SelectItem>
                  <SelectItem value="STARTED,PAUSED,CONTINUED">Sedang Dilayani</SelectItem>
                  <SelectItem value="STOPPED,CANCELED,TRANSFERRED">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region & Area */}
            {branchType === "" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-muted-foreground">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Pilih Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {regionOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(branchType === "REGION" || branchType === "") && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-muted-foreground">Area</Label>
                  <Select
                    value={area}
                    onValueChange={setArea}
                    disabled={region === ""}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Pilih Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {areaOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(branchType === "AREA" || branchType === "REGION" || branchType === "") && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-muted-foreground">Cabang</Label>
                  <Select
                    value={branch}
                    onValueChange={setBranch}
                    disabled={area === ""}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Pilih Cabang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {branchOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
          </div>

          {/* Pencarian */}
          <div className="flex justify-end col-span-full pt-10">
            <Input
              id="search"
              placeholder="Masukkan kata kunci pencarian.."
              className="max-w-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Reset Button */}
          {/* <div className="space-y-1.5 flex justify-end">
              <Button variant="ghost" onClick={handleResetFilter}>Reset</Button>
            </div> */}
          {/* Table */}
          <div className="mt-4 -mx-6">
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
        </CardContent>
      </Card>
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
