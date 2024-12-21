// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import dynamic from "next/dynamic";
// import { useSession } from "next-auth/react";
// import Modal from "react-modal"; // Import React Modal
// import { TableColumn } from 'react-data-table-component';

// const DataTable = dynamic(() => import("react-data-table-component"), {
//   ssr: false,
// });

// interface MatrixItem {
//   id: number;
//   modelType: string;
//   event: string;
//   createdAt: string;
// }

// const ApprovalMatrix: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editData, setEditData] = useState<MatrixItem | null>(null);

//   const { data: session, status } = useSession();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/master/approval-matrix");
//         if (!response.ok) {
//           throw new Error(`Failed to fetch data: ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.success && Array.isArray(data.data)) {
//           const modifiedData = data.data.map((item: any, index: number) => ({
//             ...item,
//             id: index + 1,
//           }));
//           setMatrixData(modifiedData);
//         } else {
//           setError("Invalid data format or failed to fetch data.");
//         }
//       } catch (error: any) {
//         setError("Error occurred while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [session, status]);

//   const filteredData = useMemo(() => {
//     return matrixData.filter(
//       (item) =>
//         item.modelType.toLowerCase().includes(search.toLowerCase()) ||
//         item.event.toLowerCase().includes(search.toLowerCase()) ||
//         item.createdAt.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [search, matrixData]);

//   const columns: TableColumn<MatrixItem>[] = [
//     {
//       name: "ID",
//       selector: (row: MatrixItem) => row.id,
//       sortable: true,
//       style: { width: "50px", textAlign: "center" },
//     },
//     {
//       name: "Model Type",
//       selector: (row: MatrixItem) => row.modelType,
//       sortable: true,
//     },
//     {
//       name: "Event",
//       selector: (row: MatrixItem) => row.event,
//       sortable: true,
//     },
//     {
//       name: "Actions",
//       cell: (row: MatrixItem) => (
//         <div className="flex space-x-2">
//           <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
//             Detail
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             className="text-green-500 hover:underline"
//           >
//             Edit
//           </button>
//           <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];


//   const handleDetail = (row: MatrixItem) => {
//     console.log("Detail of", row);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Are you sure you want to delete this item?")) {
//       try {
//         const response = await fetch(`/api/master/approval-matrix/${id}`, {
//           method: "DELETE",
//         });
//         if (response.ok) {
//           setMatrixData((prevData) => prevData.filter((item) => item.id !== id));
//         } else {
//           alert("Failed to delete item.");
//         }
//       } catch (error) {
//         alert("Error occurred while deleting item.");
//       }
//     }
//   };

//   const handleEdit = (row: MatrixItem) => {
//     setEditData(row);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setEditData(null);
//   };

//   const handleSave = async () => {
//     if (!editData) return;

//     try {
//       const response = await fetch(`/api/master/approval-matrix/${editData.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editData), // Data yang akan diupdate
//       });

//       if (response.ok) {
//         // Memperbarui data di state `matrixData` setelah berhasil diupdate
//         setMatrixData((prevData) =>
//           prevData.map((item) =>
//             item.id === editData.id ? { ...item, ...editData } : item
//           )
//         );
//         setIsModalOpen(false); // Menutup modal setelah berhasil update
//       } else {
//         alert("Failed to update item.");
//       }
//     } catch (error) {
//       alert("Error occurred while saving item.");
//     }
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-4 py-2 w-full rounded-md"
//         />
//       </div>

//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           {filteredData.length === 0 ? (
//             <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
//               <table className="min-w-full">
//                 <thead>
//                   <tr></tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan={columns.length} className="text-center py-4">
//                       No data available
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <DataTable
//               columns={columns}
//               data={filteredData}
//               pagination
//               paginationPerPage={5}
//               paginationRowsPerPageOptions={[5, 10, 20]}
//             />
//           )}
//         </>
//       )}

//       {/* Modal Edit Data */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={handleModalClose}
//         contentLabel="Edit Item"
//         className="modal"
//       >
//         <h2 className="text-xl font-bold mb-4">Edit Approval Matrix</h2>
//         {editData && (
//             <div>
//               <div className="mb-4">
//                 <label htmlFor="modelType" className="block text-sm font-medium text-gray-700">
//                   Model Type
//                 </label>
//                 <input
//                   id="modelType"
//                   type="text"
//                   value={editData.modelType}
//                   onChange={(e) => setEditData({ ...editData, modelType: e.target.value })}
//                   className="border px-4 py-2 w-full rounded-md"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label htmlFor="event" className="block text-sm font-medium text-gray-700">
//                   Event
//                 </label>
//                 <input
//                   id="event"
//                   type="text"
//                   value={editData.event}
//                   onChange={(e) => setEditData({ ...editData, event: e.target.value })}
//                   className="border px-4 py-2 w-full rounded-md"
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
//                   Cancel
//                 </button>
//                 <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">
//                   Save
//                 </button>
//               </div>
//             </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default ApprovalMatrix;


"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal"; // Import React Modal
import { TableColumn } from 'react-data-table-component';

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
  // const [newMatrix, setNewMatrix] = useState<MatrixItem>({ modelType: "", roleId:"", event: "", createdAt: "" }); // New Matrix Data
  const [newMatrix, setNewMatrix] = useState<{ modelType: string; event: string }>({ modelType: "", event: "" }); // New Matrix Data without roleId and createdAt

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/master/approval-matrix");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const modifiedData = data.data.map((item: any, index: number) => ({
            ...item,
            id: index + 1,
          }));
          setMatrixData(modifiedData);
        } else {
          setError("Invalid data format or failed to fetch data.");
        }
      } catch (error: any) {
        setError("Error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, status]);

  const filteredData = useMemo(() => {
    return matrixData.filter(
      (item) =>
        item.modelType.toLowerCase().includes(search.toLowerCase()) ||
        item.event.toLowerCase().includes(search.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, matrixData]);

  const columns: TableColumn<MatrixItem>[] = [
    {
      name: "ID",
      selector: (row: MatrixItem) => row.id,
      sortable: true,
      style: { width: "50px", textAlign: "center" },
    },
    {
      name: "Model Type",
      selector: (row: MatrixItem) => row.modelType,
      sortable: true,
    },
    {
      name: "Event",
      selector: (row: MatrixItem) => row.event,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: MatrixItem) => (
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


  const handleDetail = (row: MatrixItem) => {
    console.log("Detail of", row);
  };

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
    setEditData(row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      const response = await fetch(`/api/master/approval-matrix/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData), // Data yang akan diupdate
      });

      if (response.ok) {
        // Memperbarui data di state `matrixData` setelah berhasil diupdate
        setMatrixData((prevData) =>
          prevData.map((item) =>
            item.id === editData.id ? { ...item, ...editData } : item
          )
        );
        setIsModalOpen(false); // Menutup modal setelah berhasil update
      } else {
        alert("Failed to update item.");
      }
    } catch (error) {
      alert("Error occurred while saving item.");
    }
  };

  // const handleCreate = async () => {
  //   // Create the new item without the 'id' field, as it will be generated by the server
  //   const newMatrixItem = {
  //     ...newMatrix, // This will contain the fields like modelType, event, etc.
  //     // createdAt: new Date().toISOString(), // Set current timestamp for createdAt
  //   };
  
  //   try {
  //     const response = await fetch("/api/master/approval-matrix", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newMatrixItem),
  //     });
  
  //     if (response.ok) {
  //       const createdItem = await response.json();
  
  //       // The server response should include the id, so we use the full created item
  //       setMatrixData((prevData) => [...prevData, createdItem]);
  //       setIsCreateModalOpen(false); // Close the modal after successful creation
  //     } else {
  //       alert("Failed to create item. Please try again.");
  //     }
  //   } catch (error) {
  //     alert("Error occurred while creating item. Please try again.");
  //   }
  // };
  
  const handleCreate = async () => {
    // Membuat objek baru untuk mengirim data ke API
    const newMatrixItem = {
      ...newMatrix, // Ini akan berisi fields seperti modelType, event, dll.
    };
  
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
  
        // Jika berhasil, tambahkan item yang baru dibuat ke dalam state matrixData
        setMatrixData((prevData) => [...prevData, createdItem]);
        setIsCreateModalOpen(false); // Tutup modal setelah berhasil membuat
      } else {
        alert("Failed to create item. Please try again.");
      }
    } catch (error) {
      alert("Error occurred while creating item. Please try again.");
    }
  };

  
  if (error) {
    return <div>{error}</div>;
  }

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
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 20]}
            />
          )}
        </>
      )}

      {/* Modal Edit Data */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Edit Item"
        className="modal"
      >
        <h2 className="text-xl font-bold mb-4">Edit Approval Matrix</h2>
        {editData && (
          <div>
            <div className="mb-4">
              <label htmlFor="modelType" className="block text-sm font-medium text-gray-700">
                Model Type
              </label>
              <input
                id="modelType"
                type="text"
                value={editData.modelType}
                onChange={(e) => setEditData({ ...editData, modelType: e.target.value })}
                className="border px-4 py-2 w-full rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="event" className="block text-sm font-medium text-gray-700">
                Event
              </label>
              <input
                id="event"
                type="text"
                value={editData.event}
                onChange={(e) => setEditData({ ...editData, event: e.target.value })}
                className="border px-4 py-2 w-full rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>


      {/* Modal for Creating New Item */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Create New Item"
        className="modal"
      >
        <h2 className="text-xl font-bold mb-4">Create Approval Matrix</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="modelType" className="block text-sm font-medium text-gray-700">
              Model Type
            </label>
            <input
              id="modelType"
              type="text"
              value={newMatrix.modelType}
              onChange={(e) => setNewMatrix({ ...newMatrix, modelType: e.target.value })}
              className="border px-4 py-2 w-full rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="event" className="block text-sm font-medium text-gray-700">
              Event
            </label>
            <input
              id="event"
              type="text"
              value={newMatrix.event}
              onChange={(e) => setNewMatrix({ ...newMatrix, event: e.target.value })}
              className="border px-4 py-2 w-full rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ApprovalMatrix;
