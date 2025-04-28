"use client";

import React, { useState, useEffect } from "react";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import ExportCSV from "@/components/Button/ExportCsvButton";
import UserCreate from "./UserCreate";
import UserDelete from "./UserDelete";
import UserEdit from "./UserEdit";
import TextInput from "@/components/Forms/TextInput";
import { FaSearch } from "react-icons/fa";
import Select from "@/components/Forms/Select";
import ResetButton from "@/components/Button/ResetButton";
import { useSession } from "next-auth/react";

const DaftarPengguna: React.FC = () => {
  const { data: session, status } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBaris, setTotalBaris] = useState(0);
  const [perHalaman, setPerHalaman] = useState(10);
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [kolomSort, setKolomSort] = useState<string | null>("id");
  const [arahSort, setArahSort] = useState<"asc" | "desc">("desc");
  const [peran, setPeran] = useState("");
  const [cari, setCari] = useState("");
  const [cariDebounce, setCariDebounce] = useState("");
  const [opsiPeran, setOpsiPeran] = useState<any[]>([]);
  const [buatBaru, setBuatBaru] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [edit, setEdit] = useState(false);
  const [penggunaTerpilih, setPenggunaTerpilih] = useState<any | null>(null);

  const idCabang = (session?.user as any)?.branch?.id?.toString() || "";

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/access/roles");
        const result = await response.json();
        if (result.success) {
          setOpsiPeran(result.data.content.map((role: any) => ({
            value: role.name,
            label: role.name,
          })));
        } else {
          throw new Error(result.message || "Gagal memuat daftar peran");
        }
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCariDebounce(cari);
    }, 500);
    return () => clearTimeout(handler);
  }, [cari]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const size = perHalaman.toString();
        const page = (halamanSaatIni - 1).toString();
        const sortBy = kolomSort ?? "id";
        const direction = arahSort;
        const namaPeran = peran;

        const queryParams = new URLSearchParams({
          branchId: idCabang,
          size,
          page,
          sortBy,
          direction,
          roleName: namaPeran,
          search: cariDebounce,
        });

        const response = await fetch(`/api/access/users?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data.content);
          setTotalBaris(result.data.totalElements);
        } else {
          throw new Error(result.message || "Gagal memuat pengguna");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (edit || buatBaru || hapus) return;
    fetchData();
  }, [perHalaman, halamanSaatIni, kolomSort, arahSort, cariDebounce, peran, edit, buatBaru, hapus, idCabang]);

  const handlePerHalaman = (newPerPage: number, page: number) => {
    setPerHalaman(newPerPage);
    setHalamanSaatIni(page);
  };

  const handleHalaman = (page: number) => setHalamanSaatIni(page);
  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setKolomSort(column.selector);
    setArahSort(sortDirection);
  };
  const handleResetFilter = () => setCari("");

  const formatTanggal = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID');
  };

  const bukaBuatBaru = () => setBuatBaru(true);
  const tutupBuatBaru = () => setBuatBaru(false);
  const bukaEdit = (user: any) => { setPenggunaTerpilih(user); setEdit(true); };
  const tutupEdit = () => { setEdit(false); setPenggunaTerpilih(null); };
  const handleHapus = (user: any) => { setPenggunaTerpilih(user); setHapus(true); };
  const tutupHapus = () => { setHapus(false); setPenggunaTerpilih(null); };

  const kolom = [
    {
      name: 'ID Pegawai',
      selector: (row: { officialId: any; }) => row?.officialId || '-',
      sortable: true,
      sortField: 'officialId',
    },
    {
      name: 'Nama',
      selector: (row: { name: any; }) => row?.name || '',
      grow: 2,
      sortable: true,
      sortField: 'name',
    },
    {
      name: 'Email',
      selector: (row: { email: any; }) => row?.email || '',
      grow: 2,
      sortable: true,
      sortField: 'email',
    },
    {
      name: 'Peran',
      selector: (row: { role: any; }) => row?.role?.name || '',
    },
    {
      name: 'Login Terakhir',
      selector: (row: { lastLoginAt: string; }) => formatTanggal(row?.lastLoginAt),
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
            { label: 'Edit', icon: 'edit', action: () => bukaEdit(row) },
            { label: 'Hapus', icon: 'trash', action: () => handleHapus(row) },
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
          <Info label="No. Telepon" value={data.phone} />
          <Info label="Loket" value={data.counter?.name} />
          <Info label="Cabang" value={data.branch?.name} />
        </div>
        <div>
          <Info label="Status" value={data.active ? 'Aktif' : 'Tidak Aktif'} />
          <Info label="Dibuat Pada" value={formatTanggal(data.createdAt)} />
          <Info label="Diperbarui Pada" value={formatTanggal(data.updatedAt)} />
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
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Daftar Pengguna</h2>
          <div className="flex gap-2">
            <CreateButton onClick={bukaBuatBaru} />
            <ExportCSV data={data} filename="pengguna.csv" />
          </div>
        </div>

        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Pencarian"
              placeholder="Cari berdasarkan ID, nama, atau email..."
              value={cari}
              size="xs"
              onChange={(value) => setCari(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid col-span-2">
            <Select
              label="Peran"
              options={opsiPeran}
              size="xs"
              value={peran}
              onChange={(value) => setPeran(value as string)}
              placeholder="Pilih peran"
            />
          </div>
          <div className="grid text-sm items-end justify-end col-span-1">
            <ResetButton onClick={handleResetFilter} />
          </div>
        </div>

        <DataTable
          columns={kolom}
          data={data}
          progressPending={loading}
          progressComponent={<CustomLoader />}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          pagination
          paginationServer
          paginationTotalRows={totalBaris}
          onChangeRowsPerPage={handlePerHalaman}
          onChangePage={handleHalaman}
          onSort={handleSort}
          sortServer
        />
      </div>

      {buatBaru && <UserCreate isOpen={buatBaru} onClose={tutupBuatBaru} />}
      {hapus && <UserDelete isOpen={hapus} onClose={tutupHapus} data={penggunaTerpilih} />}
      {edit && <UserEdit isOpen={edit} onClose={tutupEdit} data={penggunaTerpilih} />}
    </div>
  );
};

export default DaftarPengguna;