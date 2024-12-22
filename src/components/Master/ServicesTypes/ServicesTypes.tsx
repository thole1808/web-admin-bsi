"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal"; // Import React Modal
import { TableColumn } from 'react-data-table-component';

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

interface ServiceTypeItem {
  id: number;
  serviceType: string;
  description: string;
  createdAt: string;
}

const ServicesTypes: React.FC = () => {
  const [search, setSearch] = useState("");
  const [servicesData, setServicesData] = useState<ServiceTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Edit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For Create Modal
  const [editData, setEditData] = useState<ServiceTypeItem | null>(null);
  const [newService, setNewService] = useState<{ serviceType: string; description: string }>({ serviceType: "", description: "" });

  const { data: session, status } = useSession();

  // Fetching data function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/master/services-types");
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setServicesData(data.data); // Directly use the API data without modifying the id
      } else {
        setError("Invalid data format or failed to fetch data.");
      }
    } catch (error: any) {
      setError("Error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load or session changes
  useEffect(() => {
    fetchData();
  }, [session, status]);

  // Update filtered data whenever search or servicesData changes
  const filteredData = useMemo(() => {
    return servicesData.filter((item) => {
      const searchTerm = search.toLowerCase();

      // Periksa dan pastikan setiap field adalah string sebelum memanggil .toLowerCase()
      const serviceTypeMatch = item.serviceType?.toLowerCase().includes(searchTerm) || false;
      const descriptionMatch = item.description?.toLowerCase().includes(searchTerm) || false;
      const createdAtMatch = item.createdAt?.toLowerCase().includes(searchTerm) || false;

      return serviceTypeMatch || descriptionMatch || createdAtMatch;
    });
  }, [search, servicesData]);

  const columns: TableColumn<ServiceTypeItem>[] = [
    {
      name: "No.",
      selector: (row: ServiceTypeItem, index: number) => index + 1, // Add serial number
      sortable: false,
      style: { width: "50px", textAlign: "center" },
    },
    {
      name: "Service Type",
      selector: (row: ServiceTypeItem) => row.serviceType,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: ServiceTypeItem) => row.description,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: ServiceTypeItem) => (
        <div className="flex space-x-2">
          <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
            Detail
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-green-500 hover:underline"
          >
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDetail = (row: ServiceTypeItem) => {
    console.log("Detail of", row);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/master/service-types/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setServicesData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          alert("Failed to delete item.");
        }
      } catch (error) {
        alert("Error occurred while deleting item.");
      }
    }
  };
  
  const handleEdit = (row: ServiceTypeItem) => {
    setEditData({ ...row }); // Ensure the latest data is set with the correct ID from the API
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null); // Clear editData when modal is closed
    setIsCreateModalOpen(false); // Menutup modal
  };
  
  const handleSave = async () => {
    if (!editData) return;

    try {
      const response = await fetch(`/api/master/service-types/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData), // Data yang akan diupdate
      });

      if (response.ok) {
        const updatedData = await response.json(); // Get the updated data from the API
        setServicesData((prevData) =>
          prevData.map((item) => (item.id === editData.id ? { ...item, ...updatedData } : item))
        );
        setIsModalOpen(false); // Close the modal after saving
        setEditData(null); // Reset editData after saving
        alert("Data updated successfully!"); // Display success message (optional)
        fetchData();
      } else {
        const errorData = await response.json(); // Extract error message from the response
        alert(`Error: ${errorData.error || 'Failed to update item.'}`); // Display the error message returned by the API
      }
    } catch (error) {
      console.error("Error occurred while saving item:", error);
      alert("Error occurred while saving item.");
    }
  };
  
  const handleCreate = async () => {
    const newServiceItem = { ...newService };
  
    try {
      const response = await fetch("/api/master/service-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newServiceItem),
      });
  
      if (response.ok) {
        const createdItem = await response.json();
        setServicesData((prevData) => [...prevData, createdItem]);
        setIsCreateModalOpen(false); // Menutup modal
        fetchData();
  
        // Reset input fields after creation
        setNewService({
          serviceType: "",
          description: "",
        });
      } else {
        // Mengambil error message dari API response
        const errorData = await response.json();
        console.error("Error creating item:", errorData); // Log error untuk debugging
  
        // Tampilkan error message jika ada
        alert(errorData.error || errorData.message || "Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred while creating item:", error); // Log error untuk debugging
      alert("Error occurred while creating item. Please try again.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-left">Service Types</h1>

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
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
              <table className="min-w-full">
                <thead>
                  <tr></tr>
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
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
            />
          )}
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Edit Service Type"
        className="modal"
      >
        <h2 className="text-xl font-bold mb-4">Edit Service Type</h2>
        {editData && (
          <div>
            <div className="mb-4">
              <label htmlFor="serviceType" className="block mb-1">Service Type</label>
              <input
                type="text"
                id="serviceType"
                value={editData.serviceType}
                onChange={(e) => setEditData({ ...editData, serviceType: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block mb-1">Description</label>
              <input
                type="text"
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={handleModalClose}
              className="bg-gray-500 text-white px-6 py-2 ml-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Create Service Type"
        className="modal"
      >
        <h2 className="text-xl font-bold mb-4">Create New Service Type</h2>
        <div className="mb-4">
          <label htmlFor="serviceType" className="block mb-1">Service Type</label>
          <input
            type="text"
            id="serviceType"
            value={newService.serviceType}
            onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
        >
          Create
        </button>
        <button
          onClick={handleModalClose}
          className="bg-gray-500 text-white px-6 py-2 ml-4 rounded-md"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default ServicesTypes;
