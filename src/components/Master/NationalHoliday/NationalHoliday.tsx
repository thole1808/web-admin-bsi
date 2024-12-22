// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import dynamic from "next/dynamic";
// import Modal from "react-modal";
// import { useSession } from "next-auth/react";

// const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

// interface NationalHolidayItem {
//     id: number;
//     date: string;
//     name: string;
// }

// const NationalHolidayMessages: React.FC = () => {
//     const [holidays, setHolidays] = useState<NationalHolidayItem[]>([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editData, setEditData] = useState<NationalHolidayItem | null>(null);
//     const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
//     const { data: session, status } = useSession();
//     type TextAlign = "left" | "center" | "right";

//     useEffect(() => {
//         fetchHolidays();
//     }, [session, status]);

//     const handleDetail = (row: NationalHolidayItem) => {
//         console.log("Detail of", row);
//     };

//     const fetchHolidays = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch("/api/master/national-holiday");
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch data: ${response.statusText}`);
//             }
//             const data = await response.json();
//             if (data.success && Array.isArray(data.data)) {
//                 setHolidays(data.data);
//             } else {
//                 setError("Invalid data format or failed to fetch data.");
//             }
//         } catch {
//             setError("Error occurred while fetching national holidays.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreate = async () => {
//         try {
//             const response = await fetch("/api/national-holidays", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newHoliday),
//             });
//             if (!response.ok) {
//                 throw new Error("Failed to create holiday.");
//             }
//             fetchHolidays();
//             setNewHoliday({ date: "", name: "" });
//             setIsModalOpen(false);
//         } catch (err: any) {
//             alert(err.message || "Error occurred while creating holiday.");
//         }
//     };

//     const handleEdit = async () => {
//         if (!editData) return;
//         try {
//             const response = await fetch(`/api/national-holidays/${editData.id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(editData),
//             });
//             if (!response.ok) {
//                 throw new Error("Failed to update holiday.");
//             }
//             fetchHolidays();
//             setIsModalOpen(false);
//         } catch (err: any) {
//             alert(err.message || "Error occurred while updating holiday.");
//         }
//     };

//     const handleDelete = async (id: number) => {
//         if (!confirm("Are you sure you want to delete this holiday?")) return;
//         try {
//             const response = await fetch(`/api/national-holidays/${id}`, { method: "DELETE" });
//             if (!response.ok) {
//                 throw new Error("Failed to delete holiday.");
//             }
//             setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
//         } catch (err: any) {
//             alert(err.message || "Error occurred while deleting holiday.");
//         }
//     };

//     const filteredHolidays = useMemo(
//         () =>
//             Array.isArray(holidays)
//                 ? holidays.filter((holiday) =>
//                       holiday.name.toLowerCase().includes(search.toLowerCase())
//                   )
//                 : [],
//         [search, holidays]
//     );

//     const columns = [
//         {
//             name: "No.",
//             selector: (_: NationalHolidayItem, index: number) => index + 1,
//             sortable: true,
//             style: { width: "50px", textAlign: "center" as TextAlign },
//         },
//         {
//             name: "Date",
//             selector: (row: NationalHolidayItem) => row.date,
//             sortable: true,
//         },
//         {
//             name: "Holiday Name",
//             selector: (row: NationalHolidayItem) => row.name,
//             sortable: true,
//         },
//         {
//             name: "Actions",
//             cell: (row: NationalHolidayItem) => (
//                 <div className="flex space-x-2">
//                     <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
//                         Detail
//                     </button>
//                     <button
//                         className="text-green-500 hover:underline"
//                         onClick={() => {
//                             setEditData(row);
//                             setIsModalOpen(true);
//                         }}
//                     >
//                         Edit
//                     </button>
//                     <button
//                         className="text-red-500 hover:underline"
//                         onClick={() => handleDelete(row.id)}
//                     >
//                         Delete
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div>
//             <h1 className="text-2xl font-bold mb-4">National Holidays</h1>

//             <div className="flex justify-between mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="border px-4 py-2 rounded-md w-1/2"
//                 />
//                 <button
//                     onClick={() => {
//                         setEditData(null);
//                         setNewHoliday({ date: "", name: "" });
//                         setIsModalOpen(true);
//                     }}
//                     className="bg-blue-500 text-white px-6 py-2 rounded-md"
//                 >
//                     Create
//                 </button>
//             </div>

//             {loading ? (
//                 <div className="text-center">Loading...</div>
//             ) : error ? (
//                 <div className="text-red-500 text-center">{error}</div>
//             ) : (
//                 <DataTable
//                     columns={columns}
//                     data={filteredHolidays}
//                     pagination
//                     highlightOnHover
//                     striped
//                 />
//             )}

//             <Modal
//                 isOpen={isModalOpen}
//                 onRequestClose={() => setIsModalOpen(false)}
//                 overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
//                 className="bg-white rounded-md p-6 w-1/3"
//             >
//                 <h2 className="text-xl font-bold mb-4">
//                     {editData ? "Edit Holiday" : "Create Holiday"}
//                 </h2>
//                 <input
//                     type="text"
//                     placeholder="Holiday Name"
//                     value={editData ? editData.name : newHoliday.name}
//                     onChange={(e) =>
//                         editData
//                             ? setEditData({ ...editData, name: e.target.value })
//                             : setNewHoliday({ ...newHoliday, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md mb-4"
//                 />
//                 <input
//                     type="date"
//                     value={editData ? editData.date : newHoliday.date}
//                     onChange={(e) =>
//                         editData
//                             ? setEditData({ ...editData, date: e.target.value })
//                             : setNewHoliday({ ...newHoliday, date: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md mb-4"
//                 />
//                 <button
//                     onClick={editData ? handleEdit : handleCreate}
//                     className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
//                 >
//                     Save
//                 </button>
//             </Modal>
//         </div>
//     );
// };

// export default NationalHolidayMessages;


"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { useSession } from "next-auth/react";

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface NationalHolidayItem {
    id: number;
    date: string;
    name: string;
}

const NationalHolidayMessages: React.FC = () => {
    const [holidays, setHolidays] = useState<NationalHolidayItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<NationalHolidayItem | null>(null);
    const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
    const { data: session, status } = useSession();
    type TextAlign = "left" | "center" | "right";

    useEffect(() => {
        fetchHolidays();
    }, [session, status]);

    const handleDetail = (row: NationalHolidayItem) => {
        console.log("Detail of", row);
    };

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/national-holidays");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setHolidays(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching national holidays.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/national-holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newHoliday),
            });
            if (!response.ok) {
                throw new Error("Failed to create holiday.");
            }
            fetchHolidays();
            setNewHoliday({ date: "", name: "" });
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while creating holiday.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/national-holidays/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update holiday.");
            }
            fetchHolidays();
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating holiday.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this holiday?")) return;
        try {
            const response = await fetch(`/api/national-holidays/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete holiday.");
            }
            setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting holiday.");
        }
    };

    const filteredHolidays = useMemo(
        () =>
            Array.isArray(holidays)
                ? holidays.filter((holiday) => {
                      // Check if holiday has a name property and it's a valid string
                      return holiday.name?.toLowerCase().includes(search.toLowerCase());
                  })
                : [],
        [search, holidays]
    );

    const columns = [
        {
            name: "No.",
            selector: (_: NationalHolidayItem, index: number) => index + 1,
            sortable: true,
            style: { width: "50px", textAlign: "center" as TextAlign },
        },
        {
            name: "Date",
            selector: (row: NationalHolidayItem) => row.date,
            sortable: true,
        },
        {
            name: "Holiday Name",
            selector: (row: NationalHolidayItem) => row.name,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row: NationalHolidayItem) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleDetail(row)} className="text-blue-500 hover:underline">
                        Detail
                    </button>
                    <button
                        className="text-green-500 hover:underline"
                        onClick={() => {
                            setEditData(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">National Holidays</h1>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-md w-1/2"
                />
                <button
                    onClick={() => {
                        setEditData(null);
                        setNewHoliday({ date: "", name: "" });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                    Create
                </button>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredHolidays}
                    pagination
                    highlightOnHover
                    striped
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-md p-6 w-1/3"
            >
                <h2 className="text-xl font-bold mb-4">
                    {editData ? "Edit Holiday" : "Create Holiday"}
                </h2>
                <input
                    type="text"
                    placeholder="Holiday Name"
                    value={editData ? editData.name : newHoliday.name}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, name: e.target.value })
                            : setNewHoliday({ ...newHoliday, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md mb-4"
                />
                <input
                    type="date"
                    value={editData ? editData.date : newHoliday.date}
                    onChange={(e) =>
                        editData
                            ? setEditData({ ...editData, date: e.target.value })
                            : setNewHoliday({ ...newHoliday, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md mb-4"
                />
                <button
                    onClick={editData ? handleEdit : handleCreate}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                    Save
                </button>
            </Modal>
        </div>
    );
};

export default NationalHolidayMessages;
