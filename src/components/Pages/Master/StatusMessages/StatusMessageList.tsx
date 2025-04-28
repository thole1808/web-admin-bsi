"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import StatusMessageCreate from "./StatusMessageCreate";
import StatusMessageDelete from "./StatusMessageDelete";
import StatusMessageEdit from "./StatusMessageEdit";
import ExportCSV from "@/components/Button/ExportCsvButton";
import TextInput from "@/components/Forms/TextInput";
import ResetButton from "@/components/Button/ResetButton";

const DaftarPesanStatus: React.FC = () => {
  const [dataAsli, setDataAsli] = useState<any[]>([]);
  const [dataTersaring, setDataTersaring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cari, setCari] = useState("");
  const [cariDebounce, setCariDebounce] = useState("");
  const [buatBaru, setBuatBaru] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [edit, setEdit] = useState(false);
  const [barisTerpilih, setBarisTerpilih] = useState<any | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCariDebounce(cari);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [cari]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/master/status-messages`);
        const result = await response.json();

        if (result.success) {
          setDataAsli(result.data);
          setDataTersaring(result.data);
        } else {
          throw new Error(result.message || "Gagal memuat data");
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!edit && !buatBaru && !hapus) {
      fetchData();
    }
  }, [edit, buatBaru, hapus]);

  useEffect(() => {
    if (!cariDebounce) {
      setDataTersaring(dataAsli);
      return;
    }

    const hasilFilter = dataAsli.filter((item) =>
      item.message.toLowerCase().includes(cariDebounce.toLowerCase()) ||
      item.status.toLowerCase().includes(cariDebounce.toLowerCase())
    );

    setDataTersaring(hasilFilter);
  }, [cariDebounce, dataAsli]);

  const handleResetFilter = () => {
    setCari("");
    setDataTersaring(dataAsli);
  };

  const kolom = [
    {
      name: "Status",
      selector: (row: { status: string }) => row?.status || "",
      sortable: true,
      sortField: "status",
    },
    {
      name: "Pesan",
      selector: (row: { message: string }) => row?.message || "",
      grow: 3,
      sortable: true,
      sortField: "message",
    },
    {
      name: "",
      right: true,
      cell: (row: any) => (
        <ActionGroup
          options={[
            { label: "Edit", icon: "edit", action: () => bukaEdit(row) },
            { label: "Hapus", icon: "trash", action: () => handleHapus(row) },
          ]}
        />
      ),
    },
  ];

  const bukaBuatBaru = () => setBuatBaru(true);
  const tutupBuatBaru = () => setBuatBaru(false);

  const bukaEdit = (row: any) => {
    setBarisTerpilih(row);
    setEdit(true);
  };

  const tutupEdit = () => {
    setEdit(false);
    setBarisTerpilih(null);
  };

  const handleHapus = (row: any) => {
    setBarisTerpilih(row);
    setHapus(true);
  };

  const tutupHapus = () => {
    setHapus(false);
    setBarisTerpilih(null);
  };

  return (
    <div className="grid gap-y-4">
      <div className="py-1 border rounded-lg bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ml-2">Daftar Pesan Status</h2>
          <div className="flex gap-2">
            <CreateButton onClick={bukaBuatBaru} />
            <ExportCSV data={dataTersaring} filename="status-messages.csv" />
          </div>
        </div>

        <div className="grid grid-cols-7 py-4 px-6 gap-3">
          <div className="grid col-span-4">
            <TextInput
              label="Pencarian"
              placeholder="Cari berdasarkan status atau pesan..."
              value={cari}
              size="xs"
              onChange={(value) => setCari(value)}
              suffixIcon={<FaSearch className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="grid col-span-3 flex items-end justify-end">
            <div>
              <ResetButton onClick={handleResetFilter} label="Atur Ulang" />
            </div>
          </div>
        </div>

        <DataTable
          columns={kolom}
          data={dataTersaring}
          progressPending={loading}
          progressComponent={<CustomLoader />}
          pagination
        />
      </div>

      {buatBaru && <StatusMessageCreate isOpen={buatBaru} onClose={tutupBuatBaru} />}
      {hapus && (
        <StatusMessageDelete
          isOpen={hapus}
          onClose={tutupHapus}
          data={barisTerpilih}
        />
      )}
      {edit && (
        <StatusMessageEdit
          isOpen={edit}
          onClose={tutupEdit}
          data={barisTerpilih}
        />
      )}
    </div>
  );
};

export default DaftarPesanStatus;