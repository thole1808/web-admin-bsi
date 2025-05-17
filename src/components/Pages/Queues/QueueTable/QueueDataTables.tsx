"use client";

import React, { useState } from "react";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";
import CustomLoader from "@/components/Tables/CustomLoader";
import { formatDateTime, statusWithStyle, slaCriteria, priorityBadge } from "./helpers";

interface Props {
  session: any;
  data: any[];
  loading: boolean;
  totalRows: number;
  perPage: number;
  currentPage: number;
  onChangePage: (page: number) => void;
  onChangePerPage: (pageSize: number) => void;
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}

const QueueDataTable: React.FC<Props> = ({
  session,
  data,
  loading,
  totalRows,
  perPage,
  currentPage,
  onChangePage,
  onChangePerPage,
  onSortChange,
}) => {
  const type = session?.user?.branch?.type;

  const [expandedRow, setExpandedRow] = useState<any | null>(null);

  const baseColumns = [
    ...(type == null
      ? [
          {
            name: "Region",
            selector: (row: any) => row.regionName || "",
            sortable: true,
            grow: 2,
            style: {
              whiteSpace: 'nowrap'
            },
          },
        ]
      : []),
    ...(type === "REGION" || type == null
      ? [
          {
            name: "Area",
            selector: (row: any) => row.areaName || "",
            sortable: true,
            grow: 2,
            style: {
              whiteSpace: 'nowrap'
            },
          },
        ]
      : []),
    ...(type === "AREA" || type === "REGION" || type == null
      ? [
          {
            name: "Branch",
            selector: (row: any) => row.branchName || "",
            sortable: true,
            grow: 2,
            style: {
              whiteSpace: 'nowrap'
            },
          },
        ]
      : []),
    { name: "Customer Name", selector: (row: any) => row.visitorName || "", sortable: true, grow: 2 },
    { name: "Date", selector: (row: any) => formatDateTime(row.createdAt), sortable: true, grow: 2 },
    { name: "Service Type", selector: (row: any) => row.serviceTypeName || "", sortable: true, grow: 2 },
    { name: "Queue No", selector: (row: any) => row.displayNo || "", sortable: true },
    { name: "Priority", selector: (row: any) => priorityBadge(row.priority), sortable: true },
    { name: "Staff", selector: (row: any) => row.userName || "", sortable: true },
    {
      name: "Status",
      selector: (row: any) => row.status || "",
      sortable: true,
      grow: 2,
      cell: (row: any) => statusWithStyle(row.status),
    },
    { name: "Waiting Time", selector: (row: any) => row.waitingDuration || "", sortable: true, grow: 2 },
    { name: "Service Time", selector: (row: any) => row.serviceDuration || "", sortable: true, grow: 2 },
    { name: "SLA Criteria", selector: (row: any) => slaCriteria(row) || "", sortable: true, grow: 2 },
  ];

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => (
    <div className="py-4 px-16 bg-gray-50 text-sm">
      <div className="grid grid-cols-3">
        <div className="space-y-2">
          <Info label="Counter" value={`${data.counterName || ""} #${data.counterNum}`} />
          <Info label="Reservation Type" value={data.type} />
          <Info label="Called At" value={formatDateTime(data.calledAt)} />
          <Info label="Started At" value={formatDateTime(data.startedAt)} />
          <Info label="Paused At" value={formatDateTime(data.pausedAt)} />
          <Info label="Resumed At" value={formatDateTime(data.continuedAt)} />
          <Info label="Canceled At" value={formatDateTime(data.canceledAt)} />
          <Info label="Transferred At" value={formatDateTime(data.transferredAt)} />
        </div>
        <div className="space-y-2 col-span-2">
          <Info label="Priority" value={data.priority ? "Yes" : "No"} />
          <Info label="Min SLA Duration" value={`${data.slaMinDuration || 0} min`} />
          <Info label="Max SLA Duration" value={`${data.slaMaxDuration || 0} min`} />
          <Info label="Paused Duration" value={`${(data.pauseDuration / 60).toFixed(0)} min`} />
          <Info label="Overall Duration" value={`${(data.overallDuration / 60).toFixed(0)} min`} />
          <Info label="Status Message" value={parseStatusMessage(data.statusMessage)} />
        </div>
      </div>
    </div>
  );

  function parseStatusMessage(value: string): string {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed.message) {
        return parsed.message;
      }
      return value;
    } catch {
      return value;
    }
  }

  return (
  <div className="w-full max-w-full overflow-x-auto border rounded-md">
    <div className="max-w-[1200px]">
      <DataTable
        columns={baseColumns}
        responsive
        highlightOnHover
        pointerOnHover
        striped
        data={data}
        progressPending={loading}
        progressComponent={<CustomLoader />}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandableRowExpanded={(row) => expandedRow === row}
        onRowClicked={(row) => setExpandedRow(row === expandedRow ? null : row)}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={onChangePerPage}
        onChangePage={onChangePage}
        onSort={(column, sortDirection) =>
          onSortChange(typeof column.selector === "string" ? column.selector : "", sortDirection)
        }
        sortServer
      />
    </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="grid grid-cols-3 max-w-sm mb-1 text-xs">
    <span>{label}</span>
    <span className="col-span-2 font-medium">:{" "}&nbsp;{value || "-"}</span>
  </div>
);

export default QueueDataTable;