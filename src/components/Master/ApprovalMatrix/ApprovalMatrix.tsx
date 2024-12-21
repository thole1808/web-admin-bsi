// // // "use client";

// // // import React, { useState, useEffect, useMemo } from "react";
// // // import dynamic from "next/dynamic";
// // // import { useSession } from "next-auth/react";
// // // import Link from "next/link"; // Import Link dari Next.js
// // // import { TableColumn } from 'react-data-table-component'; // Import TableColumn

// // // // Dynamically import DataTable component with SSR disabled
// // // const DataTable = dynamic(() => import("react-data-table-component"), {
// // //   ssr: false,
// // // });

// // // // Definisikan tipe data untuk item yang ada di matrixData
// // // interface MatrixItem {
// // //   id: number;
// // //   modelType: string;
// // //   event: string;
// // //   createdAt: string;
// // //   // Tambahkan properti lain sesuai kebutuhan
// // // }

// // // const ApprovalMatrix: React.FC = () => {
// // //   const [search, setSearch] = useState("");
// // //   const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const { data: session, status } = useSession();

// // //   // Fetch data inside useEffect to ensure it's executed only on the client-side
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);

// // //         const response = await fetch("/api/master/approval-matrix");

// // //         if (!response.ok) {
// // //           throw new Error(`Failed to fetch data: ${response.statusText}`);
// // //         }
// // //         const data = await response.json();

// // //         if (data.success && Array.isArray(data.data)) {
// // //           const modifiedData = data.data.map((item: any, index: number) => ({
// // //             ...item,
// // //             id: index + 1, // Auto-increment ID starting from 1
// // //           }));
// // //           setMatrixData(modifiedData);
// // //         } else {
// // //           setError("Invalid data format or failed to fetch data.");
// // //         }
// // //       } catch (error: any) {
// // //         setError("Error occurred while fetching data.");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, [session, status]);

// // //   const filteredData = useMemo(() => {
// // //     return matrixData.filter(
// // //       (item) =>
// // //         item.modelType.toLowerCase().includes(search.toLowerCase()) ||
// // //         item.event.toLowerCase().includes(search.toLowerCase()) ||
// // //         item.createdAt.toLowerCase().includes(search.toLowerCase())
// // //     );
// // //   }, [search, matrixData]);

// // //   const columns: TableColumn<MatrixItem>[] = [
// // //     {
// // //       name: "ID",
// // //       selector: (row: MatrixItem) => row.id,
// // //       sortable: true,
// // //       style: {
// // //         width: "50px",
// // //         textAlign: "center", // textAlign harus 'left' | 'center' | 'right'
// // //       },
// // //     },
// // //     {
// // //       name: "Model Type",
// // //       selector: (row: MatrixItem) => row.modelType,
// // //       sortable: true,
// // //     },
// // //     {
// // //       name: "Event",
// // //       selector: (row: MatrixItem) => row.event,
// // //       sortable: true,
// // //     },
// // //     {
// // //       name: "Actions",
// // //       cell: (row: MatrixItem) => (
// // //         <div className="flex space-x-2">
// // //           <button
// // //             onClick={() => handleDetail(row)}
// // //             className="text-blue-500 hover:underline"
// // //           >
// // //             Detail
// // //           </button>
// // //           <Link href={`/approval-matrix/edit/${row.id}`}>
// // //             <button className="text-green-500 hover:underline">Edit</button>
// // //           </Link>
// // //           <button
// // //             onClick={() => handleDelete(row.id)}
// // //             className="text-red-500 hover:underline"
// // //           >
// // //             Delete
// // //           </button>
// // //         </div>
// // //       ),
// // //     },
// // //   ];

// // //   if (error) {
// // //     return <div>{error}</div>;
// // //   }

// // //   const handleDetail = (row: MatrixItem) => {
// // //     console.log("Detail of", row);
// // //   };

// // //   const handleDelete = async (id: number) => {
// // //     if (confirm("Are you sure you want to delete this item?")) {
// // //       try {
// // //         const response = await fetch(`/api/master/approval-matrix/${id}`, {
// // //           method: "DELETE",
// // //         });
// // //         if (response.ok) {
// // //           setMatrixData((prevData) => prevData.filter((item) => item.id !== id));
// // //         } else {
// // //           alert("Failed to delete item.");
// // //         }
// // //       } catch (error) {
// // //         alert("Error occurred while deleting item.");
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

// // //       {loading ? (
// // //         <div className="text-center">Loading...</div>
// // //       ) : (
// // //         <>
// // //           {filteredData.length === 0 ? (
// // //             <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
// // //               <table className="min-w-full">
// // //                 <thead>
// // //                   <tr>
// // //                     {/* {columns.map((col, index) => (
// // //                       <th key={col.name || index} className="px-4 py-2 border-b">
// // //                         {col.name}
// // //                       </th>
// // //                     ))} */}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   <tr>
// // //                     <td colSpan={columns.length} className="text-center py-4">
// // //                       No data available
// // //                     </td>
// // //                   </tr>
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           ) : (
// // //             <DataTable
// // //               columns={columns}
// // //               data={filteredData}
// // //               pagination
// // //               highlightOnHover
// // //               striped
// // //               className="shadow-md rounded text-sm"
// // //             />
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ApprovalMatrix;


// // "use client";

// // import React, { useState, useEffect, useMemo } from "react";
// // import dynamic from "next/dynamic";
// // import { useSession } from "next-auth/react";
// // import Link from "next/link"; // Import Link dari Next.js
// // import { TableColumn } from 'react-data-table-component'; // Import TableColumn

// // // Dynamically import DataTable component with SSR disabled
// // const DataTable = dynamic(() => import("react-data-table-component"), {
// //   ssr: false,
// // });

// // // Definisikan tipe data untuk item yang ada di matrixData
// // interface MatrixItem {
// //   id: number;
// //   modelType: string;
// //   event: string;
// //   createdAt: string;
// //   // Tambahkan properti lain sesuai kebutuhan
// // }

// // const ApprovalMatrix: React.FC = () => {
// //   const [search, setSearch] = useState("");  // Menyimpan query pencarian
// //   const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const { data: session, status } = useSession();

// //   // Fetch data inside useEffect to ensure it's executed only on the client-side
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         const response = await fetch("/api/master/approval-matrix");

// //         if (!response.ok) {
// //           throw new Error(`Failed to fetch data: ${response.statusText}`);
// //         }
// //         const data = await response.json();

// //         if (data.success && Array.isArray(data.data)) {
// //           const modifiedData = data.data.map((item: any, index: number) => ({
// //             ...item,
// //             id: index + 1, // Auto-increment ID starting from 1
// //           }));
// //           setMatrixData(modifiedData);
// //         } else {
// //           setError("Invalid data format or failed to fetch data.");
// //         }
// //       } catch (error: any) {
// //         setError("Error occurred while fetching data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [session, status]);

// //   // Memfilter data berdasarkan pencarian
// //   const filteredData = useMemo(() => {
// //     return matrixData.filter(
// //       (item) =>
// //         item.modelType.toLowerCase().includes(search.toLowerCase()) ||
// //         item.event.toLowerCase().includes(search.toLowerCase()) ||
// //         item.createdAt.toLowerCase().includes(search.toLowerCase())
// //     );
// //   }, [search, matrixData]);

// //   // Definisikan kolom-kolom untuk DataTable
// //   const columns: TableColumn<MatrixItem>[] = [
// //     {
// //       name: "ID",
// //       selector: (row: MatrixItem) => row.id,
// //       sortable: true,
// //       style: {
// //         width: "50px",
// //         textAlign: "center", // textAlign harus 'left' | 'center' | 'right'
// //       },
// //     },
// //     {
// //       name: "Model Type",
// //       selector: (row: MatrixItem) => row.modelType,
// //       sortable: true,
// //     },
// //     {
// //       name: "Event",
// //       selector: (row: MatrixItem) => row.event,
// //       sortable: true,
// //     },
// //     {
// //       name: "Actions",
// //       cell: (row: MatrixItem) => (
// //         <div className="flex space-x-2">
// //           <button
// //             onClick={() => handleDetail(row)}
// //             className="text-blue-500 hover:underline"
// //           >
// //             Detail
// //           </button>
// //           <Link href={`/approval-matrix/edit/${row.id}`}>
// //             <button className="text-green-500 hover:underline">Edit</button>
// //           </Link>
// //           <button
// //             onClick={() => handleDelete(row.id)}
// //             className="text-red-500 hover:underline"
// //           >
// //             Delete
// //           </button>
// //         </div>
// //       ),
// //     },
// //   ];

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

// //   const handleDetail = (row: MatrixItem) => {
// //     console.log("Detail of", row);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (confirm("Are you sure you want to delete this item?")) {
// //       try {
// //         const response = await fetch(`/api/master/approval-matrix/${id}`, {
// //           method: "DELETE",
// //         });
// //         if (response.ok) {
// //           setMatrixData((prevData) => prevData.filter((item) => item.id !== id));
// //         } else {
// //           alert("Failed to delete item.");
// //         }
// //       } catch (error) {
// //         alert("Error occurred while deleting item.");
// //       }
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

// //       {/* Search Input */}
// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="border px-4 py-2 w-full rounded-md"
// //         />
// //       </div>

// //       {loading ? (
// //         <div className="text-center">Loading...</div>
// //       ) : (
// //         <>
// //           {filteredData.length === 0 ? (
// //             <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
// //               <table className="min-w-full">
// //                 <thead>
// //                   <tr>
// //                     {/* {columns.map((col, index) => (
// //                       <th key={col.name || index} className="px-4 py-2 border-b">
// //                         {col.name}
// //                       </th>
// //                     ))} */}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   <tr>
// //                     <td colSpan={columns.length} className="text-center py-4">
// //                       No data available
// //                     </td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <DataTable
// //               columns={columns}
// //               data={filteredData}
// //               pagination
// //               highlightOnHover
// //               striped
// //               className="shadow-md rounded text-sm"
// //             />
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default ApprovalMatrix;



// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import dynamic from "next/dynamic";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
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
//   const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
//   const [editData, setEditData] = useState<MatrixItem | null>(null); // Data yang akan diedit

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
//     setEditData(row); // Set the data to be edited
//     setIsModalOpen(true); // Open the modal
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false); // Close the modal
//     setEditData(null); // Clear the form
//   };

//   const handleSave = async () => {
//     if (!editData) return;

//     try {
//       const response = await fetch(`/api/master/approval-matrix/${editData.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editData),
//       });

//       if (response.ok) {
//         setMatrixData((prevData) =>
//           prevData.map((item) =>
//             item.id === editData.id ? { ...item, ...editData } : item
//           )
//         );
//         setIsModalOpen(false); // Close the modal after saving
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
//                   <tr>
//                     {/* {columns.map((col, index) => (
//                       <th key={col.name || index} className="px-4 py-2 border-b">
//                         {col.name}
//                       </th>
//                     ))} */}
//                   </tr>
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
//               highlightOnHover
//               striped
//               className="shadow-md rounded text-sm"
//             />
//           )}
//         </>
//       )}

//       {/* Modal Edit Data */}
//       <Modal isOpen={isModalOpen} onRequestClose={handleModalClose} contentLabel="Edit Item" className="modal">
//         <h2 className="text-xl font-bold mb-4">Edit Approval Matrix</h2>
//         {editData && (
//           <div>
//             <div className="mb-4">
//               <label htmlFor="modelType" className="block text-sm font-medium text-gray-700">
//                 Model Type
//               </label>
//               <input
//                 id="modelType"
//                 type="text"
//                 value={editData.modelType}
//                 onChange={(e) => setEditData({ ...editData, modelType: e.target.value })}
//                 className="border px-4 py-2 w-full rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="event" className="block text-sm font-medium text-gray-700">
//                 Event
//               </label>
//               <input
//                 id="event"
//                 type="text"
//                 value={editData.event}
//                 onChange={(e) => setEditData({ ...editData, event: e.target.value })}
//                 className="border px-4 py-2 w-full rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
//                 Created At
//               </label>
//               <input
//                 id="createdAt"
//                 type="text"
//                 value={editData.createdAt}
//                 onChange={(e) => setEditData({ ...editData, createdAt: e.target.value })}
//                 className="border px-4 py-2 w-full rounded-md"
//               />
//             </div>

//             <div className="flex justify-end space-x-2">
//               <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
//                 Cancel
//               </button>
//               <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">
//                 Save
//               </button>
//             </div>
//           </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<MatrixItem | null>(null);

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

  // const columns: TableColumn<MatrixItem>[] = [
  //   {
  //     name: "ID",
  //     selector: (row: MatrixItem) => row.id,
  //     sortable: true,
  //     style: { width: "50px", textAlign: "center" },
  //   },
  //   {
  //     name: "Model Type",
  //     selector: (row: MatrixItem) => row.modelType,
  //     sortable: true,
  //   },
  //   {
  //     name: "Event",
  //     selector: (row: MatrixItem) => row.event,
  //     sortable: true,
  //   },
  //   {
  //     name: "Actions",
  //     cell: (row: MatrixItem) => (
  //       <div className="flex space-x-2">
  //         <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
  //           Detail
  //         </button>
  //         <button
  //           onClick={() => handleEdit(row)}
  //           className="text-green-500 hover:underline"
  //         >
  //           Edit
  //         </button>
  //         <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline">
  //           Delete
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

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

  // const handleSave = async () => {
  //   if (!editData) return;
  
  //   try {
  //     const response = await fetch(`/api/master/approval-matrix/${editData.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(editData), // Data yang akan diupdate
  //     });
  
  //     if (response.ok) {
  //       setMatrixData((prevData) =>
  //         prevData.map((item) =>
  //           item.id === editData.id ? { ...item, ...editData } : item
  //         )
  //       );
  //       setIsModalOpen(false);
  //     } else {
  //       alert("Failed to update item.");
  //     }
  //   } catch (error) {
  //     alert("Error occurred while saving item.");
  //   }
  // };

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
  
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-left">Approval Matrix</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 w-full rounded-md"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <div className="overflow-x-auto border-t border-b border-l border-r shadow-md rounded text-sm">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {/* {columns.map((col, index) => (
                      <th key={col.name || index} className="px-4 py-2 border-b">
                        {col.name}
                      </th>
                    ))} */}
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

              <div className="mb-4">
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <input
                  id="createdAt"
                  type="text"
                  value={editData.createdAt}
                  onChange={(e) => setEditData({ ...editData, createdAt: e.target.value })}
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
    </div>
  );
};

export default ApprovalMatrix;
