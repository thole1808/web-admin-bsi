"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

// Dynamically import DataTable component with SSR disabled
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

const ApprovalMatrix: React.FC = () => {
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    department: true,
    role: true,
    approver: true,
    approvalLevel: true,
  });
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get session data using useSession hook
  const { data: session, status } = useSession();

  // Fetch data inside useEffect to ensure it's executed only on the client-side
  useEffect(() => {
    const fetchData = async () => {

      try {
        // Fetch data menggunakan token dari session
        const response = await fetch("/api/master/approval-matrix");

        // Jika respons tidak berhasil, lempar error
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("data:", data);

        // Pastikan data yang diterima adalah array
        if (Array.isArray(data)) {
          setMatrixData(data);
        } 
        // else {
        //   setError("Data yang diterima tidak valid.");
        // }
      } catch (error: any) {
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  // Gunakan useMemo untuk mengoptimalkan pemfilteran data
  const filteredData = useMemo(() => {
    return Array.isArray(matrixData)
      ? matrixData.filter(
          (item) =>
            item.department.toLowerCase().includes(search.toLowerCase()) ||
            item.role.toLowerCase().includes(search.toLowerCase()) ||
            item.approver.toLowerCase().includes(search.toLowerCase()) ||
            item.approvalLevel.toLowerCase().includes(search.toLowerCase())
        )
      : [];
  }, [search, matrixData]);

  // Definisikan kolom untuk DataTable
  const columns = [
    {
      name: "Department",
      selector: (row: any) => row.department,
      sortable: true,
      omit: !visibleColumns.department,
    },
    {
      name: "Role",
      selector: (row: any) => row.role,
      sortable: true,
      omit: !visibleColumns.role,
    },
    {
      name: "Approver",
      selector: (row: any) => row.approver,
      sortable: true,
      omit: !visibleColumns.approver,
    },
    {
      name: "Approval Level",
      selector: (row: any) => row.approvalLevel,
      sortable: true,
      omit: !visibleColumns.approvalLevel,
    },
  ];

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex mb-10 justify-between items-center py-5 w-full">
        <div className="container mx-auto p-4 max-w-screen-lg">
          <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

          {/* <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded w-full sm:w-1/3"
            />

            <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
              {Object.keys(visibleColumns).map((key) => (
                <button
                  key={key}
                  onClick={() =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                  className={`border px-2 py-1 rounded text-sm ${visibleColumns[key as keyof typeof visibleColumns]
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                    }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div> */}

          {/* Tampilkan pesan jika data kosong, namun tetap mempertahankan struktur tabel */}
          {filteredData.length === 0 ? (
            <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.name} className="px-4 py-2 border-b">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            // Conditionally render the DataTable to avoid mismatches during hydration
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              className="shadow-md rounded text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalMatrix;
