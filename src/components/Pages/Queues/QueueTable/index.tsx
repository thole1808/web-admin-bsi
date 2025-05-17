// File: components/QueueTable/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/apiClient";
import Filters from "./QueueTableFilters";
import { Export } from "./QueueExport";
import QueueDataTable from "./QueueDataTables";

const today = new Date().toISOString().split("T")[0];

const QueueTable: React.FC = () => {
  const { data: session } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    region: "all",
    area: "all",
    branch: "all",
    frontliner: "all",
    startDate: today,
    endDate: today,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const queryParams = new URLSearchParams({
          start: filters.startDate,
          end: filters.endDate,
          search: debouncedSearch,
          status: filters.status === "all" ? "" : filters.status,
          frontliner: filters.frontliner === "all" ? "" : filters.frontliner,
          type: filters.type === "all" ? "" : filters.type,
          regionId: filters.region === "all" ? "" : filters.region,
          areaId: filters.area === "all" ? "" : filters.area,
          branchId: filters.branch === "all" ? "" : filters.branch,
          size: perPage.toString(),
          page: (currentPage - 1).toString(),
          sortBy: sortField || "createdAt",
          direction: sortDirection,
        });

        const result = await apiFetch(`/api/antrian?${queryParams.toString()}`);
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
  }, [filters, debouncedSearch, perPage, currentPage, sortField, sortDirection]);

  return (
    <div className="grid gap-4">
      <Card className="shadow-md border">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <CardTitle className="text-lg font-semibold">Queue List</CardTitle>
          <Export data={data} />
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          <Filters session={session} filters={filters} setFilters={setFilters} />
          <QueueDataTable
            session={session}
            data={data}
            loading={loading}
            totalRows={totalRows}
            perPage={perPage}
            currentPage={currentPage}
            onChangePage={setCurrentPage}
            onChangePerPage={setPerPage}
            onSortChange={(field, direction) => {
              setSortField(field);
              setSortDirection(direction);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueTable;
