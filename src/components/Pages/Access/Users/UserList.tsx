"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import ExportCSV from "@/components/Button/ExportCsvButton";
import UserManage from "./UserManage";
import UserDelete from "./UserDelete";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaSearch } from "react-icons/fa";
import { Label } from "@/components/ui/label";

const UserList: React.FC = () => {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRole, setSelectedRole] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [branch, setBranch] = useState("");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("");
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [branchOptions, setBranchOptions] = useState<any[]>([]);


  const branchId = (session?.user as any)?.branch?.id?.toString() || "";
  const branchType = (session?.user as any)?.branch?.type?.toString() || "";


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
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/access/roles");
        const result = await response.json();
        if (result.success) {
          setRoleOptions(result.data.content.map((role: any) => ({
            value: role.name,
            label: role.name,
          })));
        } else {
          throw new Error(result.message || "Failed to load roles");
        }
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchDebounced(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const size = perPage.toString();
        const page = (currentPage - 1).toString();
        const sortBy = sortColumn ?? "id";
        const direction = sortDirection;
        const roleName = selectedRole === "all" ? "" : selectedRole;
        const areaId = area === "all" ? "" : area;
        const regionId = region === "all" ? "" : region;
        const branchId = branch === "all" ? "" : branch;

        const queryParams = new URLSearchParams({
          branchId,
          areaId,
          regionId,
          size,
          page,
          sortBy,
          direction,
          roleName,
          search: searchDebounced,
        });

        const response = await fetch(`/api/access/users?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setUsers(result.data.content);
          setTotalRows(result.data.totalElements);
        } else {
          throw new Error(result.message || "Failed to load users");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isCreating || isEditing || isDeleting) return;
    fetchUsers();
  }, [perPage, currentPage, sortColumn, sortDirection, searchDebounced, selectedRole, isCreating, isEditing, isDeleting, branchId, area, region, branch]);

  const handlePerPage = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSort = (column: any, direction: "asc" | "desc") => {
    setSortColumn(column.selector);
    setSortDirection(direction);
  };

  const handleResetFilter = () => {
    setSearch("");
    setSelectedRole("");
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID');
  };

  const openCreate = () => setIsCreating(true);
  const closeCreate = () => setIsCreating(false);
  const openEdit = (user: any) => { setSelectedUser(user); setIsEditing(true); };
  const closeEdit = () => { setIsEditing(false); setSelectedUser(null); };
  const openDelete = (user: any) => { setSelectedUser(user); setIsDeleting(true); };
  const closeDelete = () => { setIsDeleting(false); setSelectedUser(null); };

  const columns = [
    {
      name: 'Nama',
      selector: (row: any) => row?.name || '',
      grow: 2,
      sortable: true,
      sortField: 'name',
    },
    {
      name: 'Jenis Pengguna',
      selector: (row: any) => row?.type || '-',
      sortable: true,
      sortField: 'type',
    },
    {
      name: 'Email',
      selector: (row: any) => row?.email || '',
      grow: 2,
      sortable: true,
      sortField: 'email',
    },
    {
      name: 'Peran',
      selector: (row: any) => row?.role?.name || '',
    },
    {
      right: true,
      name: 'Terakhir Login',
      selector: (row: any) => formatDate(row?.lastLoginAt),
      grow: 2,
      sortable: true,
      sortField: 'lastLoginAt',
    },
    {
      name: '',
      right: true,
      cell: (row: any) => (
        <ActionGroup
          options={[
            { label: 'Edit', icon: 'edit', action: () => openEdit(row) },
            { label: 'Delete', icon: 'trash', action: () => openDelete(row) },
          ]}
        />
      ),
    },
  ];

  const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => (
    <div className="p-6 bg-gray-50 text-sm">
      <div className="grid grid-cols-2">
        <div>
          <Info label="Username" value={data.username} />
          <Info label="No. Telp" value={data.phone} />
          <Info label="Loket" value={data.counter?.name} />
          <Info label="Cabang" value={data.branch?.name} />
        </div>
        <div>
          <Info label="Status" value={data.active ? 'Active' : 'Inactive'} />
          <Info label="Dibuat tanggal" value={formatDate(data.createdAt)} />
          <Info label="Diperbarui tanggal" value={formatDate(data.updatedAt)} />
        </div>
      </div>
    </div>
  );

  const Info = ({ label, value }: { label: string, value: any }) => (
    <div className="grid grid-cols-3 max-w-sm mb-1">
      <span>{label}</span>
      <span className="col-span-2">:&nbsp;{value || '-'}</span>
    </div>
  );

  if (status === "loading") return null;

  return (
    <div className="grid gap-6">
      <Card className="bg-white shadow-md border rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <CardTitle className="text-lg font-semibold text-slate-800">Daftar Pengguna</CardTitle>
          <div className="flex gap-2">
            <Button variant="default" onClick={openCreate}>Buat Baru</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 py-4">
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">

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

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Peran</Label>
              <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"all"} value={"all"}>All</SelectItem>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end col-span-full pt-10">
            <Input
              id="search"
              placeholder="Masukkan kata kunci pencarian.."
              className="max-w-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-span-1 flex items-end justify-end">
            <Button variant="ghost" onClick={handleResetFilter}>Reset</Button>
          </div>
        </CardContent>

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={users}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerPage}
            onChangePage={handlePageChange}
            onSort={handleSort}
            sortServer
          />
        </div>
      </Card>

      {isCreating && <UserManage isOpen={isCreating} onClose={closeCreate} mode="create" />}
      {isDeleting && <UserDelete isOpen={isDeleting} onClose={closeDelete} data={selectedUser} />}
      {isEditing && <UserManage isOpen={isEditing} onClose={closeEdit} initialData={selectedUser} mode="edit" />}
    </div>
  );
};

export default UserList;