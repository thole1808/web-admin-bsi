"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ClipLoader } from "react-spinners";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

interface MatrixItem {
  id: number;
  modelType: string;
  event: string;
  createdAt: string;
}

const ApprovalMatrix: React.FC = () => {
  const [search, setSearch] = useState("");
  const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Edit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For Create Modal
  const [editData, setEditData] = useState<MatrixItem | null>(null);
  const [newMatrix, setNewMatrix] = useState<{ modelType: string; event: string }>({ modelType: "", event: "" });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const [detailData, setDetailData] = useState<MatrixItem | null>(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/master/approval-matrix");
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setMatrixData(data.data);
      } else {
        setError("Invalid data format or failed to fetch data.");
      }
    } catch (error: any) {
      setError("Error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalDetail = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/master/approval-matrix/${id}`);
      if (!response.ok) throw new Error("Failed to fetch approval matrix details.");
      const data = await response.json();
      setDetailData(data.data);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      alert(err.message || "Error occurred while fetching approval matrix details.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [session, status]);

  const filteredData = useMemo(() => {
    return matrixData.filter((item) => {
      const searchTerm = search.toLowerCase();
      const modelTypeMatch = item.modelType?.toLowerCase().includes(searchTerm) || false;
      const eventMatch = item.event?.toLowerCase().includes(searchTerm) || false;
      const createdAtMatch = item.createdAt?.toLowerCase().includes(searchTerm) || false;
      return modelTypeMatch || eventMatch || createdAtMatch;
    });
  }, [search, matrixData]);

  const columns: TableColumn<MatrixItem>[] = [
    {
      name: "No.",
      selector: (row: MatrixItem, index: number) => index + 1,
      sortable: false,
      maxWidth: "1px",
      minWidth: "70px",
    },
    {
      name: "Model Type",
      selector: (row: MatrixItem) => row.modelType,
      sortable: true,
      minWidth: "5px",
      grow: 1,
    },
    {
      name: "Event",
      selector: (row: MatrixItem) => row.event,
      sortable: true,
      minWidth: "50px",
      grow: 1,
    },
    {
      name: "Actions",
      grow: 2,
      cell: (row: MatrixItem) => (
        <div className="flex flex-wrap gap-2 justify-start w-full">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={() => fetchApprovalDetail(row.id)}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
            >
              <EyeIcon className="h-5 w-5" />
              <span>Detail</span>
            </button>
            <button
              onClick={() => handleEdit(row)}
              className="text-green-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
            >
              <TrashIcon className="h-5 w-5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/master/approval-matrix/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setMatrixData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          alert("Failed to delete item.");
        }
      } catch (error) {
        alert("Error occurred while deleting item.");
      }
    }
  };

  const handleEdit = (row: MatrixItem) => {
    setEditData({ ...row });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null); 
    setIsCreateModalOpen(false); 
  };
  // 
  const handleSave = async () => {
    if (!editData) return;

    try {
      const response = await fetch(`/api/master/approval-matrix/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData), 
      });

      if (response.ok) {
        const updatedData = await response.json(); 
        setMatrixData((prevData) =>
          prevData.map((item) => (item.id === editData.id ? { ...item, ...updatedData } : item))
        );
        setIsModalOpen(false); 
        setEditData(null); 
        alert("Data updated successfully!"); 
        fetchData();
      } else {
        const errorData = await response.json(); 
        alert(`Error: ${errorData.error || 'Failed to update item.'}`); 
    } catch (error) {
      console.error("Error occurred while saving item:", error);
      alert("Error occurred while saving item.");
    }
  };

  const handleCreate = async () => {
    const newMatrixItem = { ...newMatrix };

    try {
      const response = await fetch("/api/master/approval-matrix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMatrixItem),
      });

      if (response.ok) {
        const createdItem = await response.json();
        setMatrixData((prevData) => [...prevData, createdItem]);
        setIsCreateModalOpen(false);
        fetchData();
        setNewMatrix({
          modelType: "",
          event: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Error creating item:", errorData); 

        alert(errorData.error || errorData.message || "Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred while creating item:", error); 
      alert("Error occurred while creating item. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

      <div className="flex justify-between mb-4">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 w-full rounded-md"
          />
        </div>
        <div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            Create
          </button>
        </div>
      </div>

      {loading ? (
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ClipLoader size={50} color="#4B5563" loading={loading} />
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="relative">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            responsive
          />
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Edit Approval Matrix"
        className="modal"
      >
        <h2 className="text-xl font-bold mb-4">Edit Approval Matrix</h2>
        {editData && (
          <div>
            <div className="mb-4">
              <label htmlFor="modelType" className="block mb-1">Model Type</label>
              <input
                type="text"
                id="modelType"
                value={editData.modelType}
                onChange={(e) => setEditData({ ...editData, modelType: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="event" className="block mb-1">Event</label>
              <input
                type="text"
                id="event"
                value={editData.event}
                onChange={(e) => setEditData({ ...editData, event: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-2 rounded-md">
                Update
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={handleModalClose} 
        contentLabel="Create Approval Matrix"
        className="modal"
        ariaHideApp={false} 
      >
        <h2 className="text-xl font-bold mb-4">Create Approval Matrix</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="modelType" className="block mb-1">Model Type</label>
            <input
              type="text"
              id="modelType"
              value={newMatrix.modelType}
              onChange={(e) => setNewMatrix({ ...newMatrix, modelType: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="event" className="block mb-1">Event</label>
            <input
              type="text"
              id="event"
              value={newMatrix.event}
              onChange={(e) => setNewMatrix({ ...newMatrix, event: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleModalClose} 
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate} 
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

        {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen} 
        onRequestClose={() => setIsDetailModalOpen(false)} // Menutup modal
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Approval Matrix Detail</h2>

        {detailData ? (
          <div className="overflow-x-auto">
            {/* Tabel untuk menampilkan detail approval matrix */}
            <table className="min-w-full table-auto">
              <tbody>
                {/* Row untuk Model Type */}
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-600">Model Type</td>
                  <td className="px-4 py-2">{detailData.modelType}</td>
                </tr>
                {/* Row untuk Event */}
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-600">Event</td>
                  <td className="px-4 py-2">{detailData.event}</td>
                </tr>
                {/* Row untuk Created At */}
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-600">Created At</td>
                  <td className="px-4 py-2">
                    {new Date(detailData.createdAt).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No details available.</p>
        )}

        {/* Button to Close Modal */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setIsDetailModalOpen(false)} 
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default ApprovalMatrix;
