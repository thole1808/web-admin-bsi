"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import CustomLoader from "../../Tables/CustomLoader";
import ExportCSV from "../../Button/ExportCsvButton";
import TextInput from "../../Forms/TextInput";
import { FaCog, FaSearch } from "react-icons/fa";
import ResetButton from "../../Button/ResetButton";
import Select from "../../Forms/Select";
import Link from "next/link";
import { useSession } from "next-auth/react";

const BranchList: React.FC = () => {
  const { data: session, status } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [typeField, setTypeField] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [area, setArea] = useState("");
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);

  const branchType = (session?.user as any)?.branch?.type ?? null;

  const [region, setRegion] = useState(session?.user?.branch?.regionId || "");

  const typeOptions = [
    { value: 'REGION', label: 'Region' },
    { value: 'AREA', label: 'Area' },
    { value: 'BRANCH', label: 'Cabang' },
  ];

  useEffect(() => {
    const loadRegions = async () => {
      setArea('');
      try {
        const response = await fetch(`/api/branches?type=REGION&size=100`);
        const result = await response.json();
        if (result.success) {
          setRegionOptions(result.data.content.map((branch: any) => ({
            value: branch.id,
            label: branch.name,
          })));
        }
      } catch (err) {
        console.error('Gagal mengambil data region:', err);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const loadAreas = async () => {
      if (!region) return;

      try {
        const response = await fetch(`/api/branches?type=AREA&regionId=${region}`);
        const result = await response.json();
        if (result.success) {
          setAreaOptions(result.data.content.map((branch: any) => ({
            value: branch.id,
            label: branch.name,
          })));
        }
      } catch (err) {
        console.error('Gagal mengambil data area:', err);
      }
    };

    loadAreas();
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
    const fetchData = async () => {
      try {
        const size = perPage.toString();
        const page = (currentPage - 1).toString();
        const sortBy = sortField ?? "id";
        const direction = sortDirection;
        const searchQuery = debouncedSearch;
        const type = typeField;
        const areaId = area;
        const regionId = region;

        const queryParams = new URLSearchParams({
          size,
          page,
          sortBy,
          direction,
          type,
          search: searchQuery,
          areaId,
          regionId,
        });

        const response = await fetch(`/api/branches?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data.content);
          setTotalRows(result.data.totalElements);
        } else {
          throw new Error(result.message || "Gagal mengambil data cabang");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "authenticated") return;

    fetchData();
  }, [perPage, currentPage, sortField, sortDirection, debouncedSearch, typeField, area, region, status]);

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => (
    <div className="py-4 px-16 bg-gray-50 text-sm">
      <div className="grid grid-cols-2">
        <div>
          <InfoRow label="Area" value={data.areaName} />
          <InfoRow label="Region" value={data.regionName} />
          <InfoRow label="Alamat" value={data.address} />
          <InfoRow label="Telepon" value={data.phone} />
          <InfoRow label="Zona Waktu" value={data.timezone} />
        </div>
        <div>
          <InfoRow label="Aktif" value={data.active ? 'Ya' : 'Tidak'} />
          <InfoRow label="Dibuat Pada" value={formatDateTime(data.createdAt)} />
          <InfoRow label="Diperbarui Pada" value={formatDateTime(data.updatedAt)} />
        </div>
      </div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 max-w-sm mb-1">
      <span className="font-medium">{label}</span>
      <span className="col-span-2">:&nbsp;{value || '-'}</span>
    </div>
  );

  const formatDateTime = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID');
  };

  const typeWithStyle = (type: string) => {
    if (!type) return '';
    let style = 'px-2 py-1 rounded text-xs font-medium ';
    switch (type) {
      case 'BRANCH': style += 'bg-yellow-100 text-yellow-700'; break;
      case 'AREA': style += 'bg-blue-100 text-blue-700'; break;
      case 'REGION': style += 'bg-green-100 text-green-700'; break;
      default: break;
    }
    return (<div className={style}>{type}</div>);
  };

  const columns = [
    { name: 'Kode', selector: (row: any) => row.code || '', sortable: true, sortField: 'code' },
    { name: 'Nama', selector: (row: any) => row.name || '', grow: 2, sortable: true, sortField: 'name' },
    { name: 'Tipe', selector: (row: any) => row.type || '', sortable: true, sortField: 'type', cell: (row: any) => typeWithStyle(row.type) },
    { name: 'Unit', selector: (row: any) => row.unit || '', sortable: true, sortField: 'unit' },
    { name: 'Kapasitas Ruangan', selector: (row: any) => row.maxRoomCapacity || '', sortable: true, sortField: 'maxRoomCapacity' },
    { name: 'Kuota Antrian', selector: (row: any) => row.maxQueueCapacity || '', sortable: true, sortField: 'maxQueueCapacity' },
    { name: 'Terakhir Diperbarui', selector: (row: any) => formatDateTime(row.updatedAt), grow: 2, right: true, sortable: true, sortField: 'updatedAt' },
    {
      name: "", right: true, cell: (row: any) => (
        <Link href={`/branches/${row.id}`} className="text-sm border font-medium rounded bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-2 flex gap-1 items-center">
          Kelola <FaCog className="w-3 h-3" />
        </Link>
      )
    },
  ];

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setSortField(column.selector);
    setSortDirection(sortDirection);
  };

  const handleResetFilter = () => {
    setTypeField("");
    setSearch("");
    setRegion("");
    setArea("");
  };

  if (status === "loading") return null;

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Cabang</h2>
          <ExportCSV data={data} filename="cabang.csv" />
        </div>

        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Cari"
              placeholder="Cari berdasarkan kode atau nama..."
              value={search}
              size="xs"
              onChange={(value) => setSearch(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid col-span-2">
            <Select
              label="Tipe"
              options={typeOptions}
              size="xs"
              value={typeField}
              onChange={(value) => setTypeField(value as string)}
              placeholder="Pilih tipe"
            />
          </div>
          <div className="grid text-sm items-end justify-end col-span-1">
            <ResetButton onClick={handleResetFilter} label="Atur Ulang" />
          </div>

          {['HO'].includes(branchType) && (
            <div className="grid col-span-2">
              <Select label="Region" size="xs" options={regionOptions} value={region} onChange={(value) => setRegion(value as string)} />
            </div>
          )}

          {['HO'].includes(branchType) && (
            <div className="grid col-span-2">
              <Select label="Area" size="xs" options={areaOptions} value={area} onChange={(value) => setArea(value as string)} />
            </div>
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

export default BranchList;