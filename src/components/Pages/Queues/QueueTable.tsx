"use client";

import React, { useState, useEffect  } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import { FaRotateLeft } from "react-icons/fa6";
import CustomLoader from "../../Tables/CustomLoader";

const QueueTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        console.error(err.message);
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

  const Export: React.FC<{ onExport: () => void }> = ({ onExport }) => <button className="text-xs py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700 mr-2" onClick={() => onExport()}>Download CSV</button>;

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <div className="py-4 px-16 bg-gray-50 text-xs">
        <div className="grid grid-cols-2">
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Counter</span>
              <span className="col-span-2">:&nbsp;{data.counterName || ''} #{data.counterNum}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Officer</span>
              <span className="col-span-2">:&nbsp;{data.userName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Branch</span>
              <span className="col-span-2">:&nbsp;{data.branchName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Area</span>
              <span className="col-span-2">:&nbsp;{data.areaName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Region</span>
              <span className="col-span-2">:&nbsp;{data.regionName || ''}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Reservation Type</span>
              <span className="col-span-2">:&nbsp;{data.type}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Reservation Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.createdAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Called Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.calledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Served Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.startedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Paused Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.pausedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Continued Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.continuedAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Canceled Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.canceledAt)}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Transferred Time</span>
              <span className="col-span-2">:&nbsp;{formatDateTime(data.transferredAt)}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Is Priority</span>
              <span className="col-span-2">:&nbsp;{data.priority ? 'Yes' : 'No'}</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">SLA Min. Duration</span>
              <span className="col-span-2">:&nbsp;{data.slaMinDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">SLA Maks. Duration</span>
              <span className="col-span-2">:&nbsp;{data.slaMaxDuration || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Waiting Duration</span>
              <span className="col-span-2">:&nbsp;{(data.waitingDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Service Duration</span>
              <span className="col-span-2">:&nbsp;{(data.serviceDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Pause Duration</span>
              <span className="col-span-2">:&nbsp;{(data.pauseDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Total Duration</span>
              <span className="col-span-2">:&nbsp;{(data.overallDuration / 60).toFixed(0) || 0} menit</span>
            </div>
            <div className="grid grid-cols-3 max-w-sm mb-1">
              <span className="font-medium">Status Message</span>
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
    setSearch("");
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
      name: 'Branch',
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
      name: 'Date',
      selector: (row: { createdAt: string; }) => formatDateTime(row?.createdAt) || '',
      grow: 2,
      sortable: true,
      sortField: 'createdAt',
    },
    {
      name: 'Resv. Code',
      selector: (row: { reservationCode: string; }) => row?.reservationCode || '',
      grow: 2,
      sortable: true,
      sortField: 'reservationCode',
    },
    {
      name: 'Service Type',
      selector: (row: { serviceTypeName: string; }) => row?.serviceTypeName || '',
      grow: 2,
      sortable: true,
      sortField: 'serviceTypeName',
    },
    {
      name: 'Queue No.',
      selector: (row: { displayNo: string; }) => row?.displayNo || '',
      sortable: true,
      sortField: 'displayNo',
    },
    {
      name: 'Officer',
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
      name: 'SLA Criteria',
      selector: (row: { status: string; }) => slaCriteria(row) || '',
      grow: 2,
      sortable: true,
      sortField: 'status',
      conditionalCellStyles: [
        {
          when: (row: { serviceDuration: number; slaMinDuration: number; status: string }) => isCompleted(row.status) && row.serviceDuration / 60 < row.slaMinDuration,
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
    return status === 'STOPPED' || status === 'TRANSFERRED'; 
  }

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Queues</h2>
          <div>
            <Export onExport={() => downloadCSV(data)} />
          </div>
        </div>
        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <label className="text-xs mb-1">Search</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="text" value={search} onChange={handleInputChange} placeholder="Search by resv. code, queue number, service type or branch..." />
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">Reservation Type</label>
            <select className="border border-gray-300 w-full text-sm py-1 px-2 rounded" value={typeField} onChange={handleTypeChange}>
              <option value="">All</option>
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
            <label className="text-xs mb-1">From Date</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="date" value={fromDate} onChange={handleFromDateChange} max={today} />
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">To Date</label>
            <input className="border border-gray-300 w-full text-sm py-1 px-2 rounded" type="date" value={toDate} onChange={handleToDateChange} max={today} />
          </div>
          <div className="grid col-span-2">
            <label className="text-xs mb-1">Status</label>
            <select className="border border-gray-300 w-full text-sm py-1 px-2 rounded" value={statusField} onChange={handleStatusChange}>
              <option value="">All</option>
              <option value="waiting">Waiting</option>
              <option value="serving">Served</option>
              <option value="done">Completed</option>
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

export default QueueTable;
