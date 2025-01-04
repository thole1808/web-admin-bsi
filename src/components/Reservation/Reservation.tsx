"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import { TableColumn } from 'react-data-table-component';
import { ClipLoader } from "react-spinners";
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

interface ReservationItem {
    id: number;
    type: string;
    counterName: string;
    code: string;
    queueNo: string;
    visitorName: string;
    visitorPhone: string;
    date: string;
    time: string;
    numberOfPeople: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    serviceTypeName: string;
    branchName: string;
    additional: string;
    active: string;
}

const Reservation: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<ReservationItem | null>(null);
    const [newReservation, setNewReservation] = useState<Partial<ReservationItem>>({
        counterName  : ""
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<ReservationItem | null>(null);
    const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchReservations(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleMouseEnter = (text: string, e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setTooltip({
            text,
            x: rect.left,
            y: rect.top + rect.height + 5,
            visible: true,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ text: "", x: 0, y: 0, visible: false });
    };

    const fetchReservations = async (page: number, size: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/reservations?page=${page}&size=${size}&sortBy=code&direction=ASC`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && data.data) {
                setReservations(data.data.content);
                setTotalRows(data.data.totalElements);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch (err) {
            setError("Error occurred while fetching reservations.");
        } finally {
            setLoading(false);
        }
    };

    const filteredReservations = useMemo(
        () =>
            Array.isArray(reservations)
                ? reservations.filter((reservation) =>
                    `${reservation.counterName} ${reservation.date}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                : [],
        [search, reservations]
    );

    const columns: TableColumn<ReservationItem>[] = [
        {
            name: "No.",
            selector: (_: ReservationItem, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
            sortable: false,
            maxWidth: "1px",
            minWidth: "70px",
        },
        {
            name: "Customer Name",
            selector: (row: ReservationItem) => row.counterName,
            sortable: true,
            minWidth: "150px",
            grow: 1,
        },
        {
            name: "Visitor Name",
            selector: (row: ReservationItem) => row.visitorName,
            sortable: true,
            minWidth: "120px",
            grow: 0,
        },
        {
            name: "Visitor Phone",
            selector: (row: ReservationItem) => row.visitorPhone,
            sortable: true,
            minWidth: "120px",
            grow: 0,
        },
        {
            name: "Type Service",
            selector: (row: ReservationItem) => row.serviceTypeName,
            sortable: true,
            minWidth: "120px",
            grow: 2,
        },
        {
            name: "Branch Service",
            selector: (row: ReservationItem) => row.branchName,
            sortable: true,
            minWidth: "120px",
            grow: 3,
        },
        {
            name: "Actions",
            right: true,
            cell: (row: ReservationItem) => (
                <div className="flex border border-gray-400 rounded divide-x divide-gray-400">
                    <button
                        onClick={() => handleDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 p-1.5"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => {
                            setIsEditModalOpen(true);
                            setEditData(row);
                        }}
                        className="text-green-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 w-full sm:w-auto"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        }
    ];

    const handleDetail = (id: number) => {
        fetchDetail(id);
        setIsDetailModalOpen(true);
    };

    const fetchDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reservations/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch reservation details.");
            }
            const data = await response.json();
            setDetailData(data.data);
        } catch (err: any) {
            console.error("Fetch error:", err);
            alert(err.message || "Error occurred while fetching reservation details.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReservation),
            });
            if (!response.ok) {
                throw new Error("Failed to create reservation.");
            }
            fetchReservations(currentPage, pageSize);
            setNewReservation({
                counterName: "",
                date: "",
                time: "",
                numberOfPeople: 1,
                status: "Pending",
            });
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while creating reservation.");
        }
    };

    const handleEdit = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`/api/reservations/${editData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Failed to update reservation.");
            }
            fetchReservations(currentPage, pageSize);
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || "Error occurred while updating reservation.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this reservation?")) return;
        try {
            const response = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete reservation.");
            }
            fetchReservations(currentPage, pageSize);
        } catch (err: any) {
            alert(err.message || "Error occurred while deleting reservation.");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Reservations</h1>

            {/* Search Input and Create Button */}
            <div className="flex justify-between mb-4">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 rounded-md w-full pr-10 border"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                </div>
                <div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-teal-500 text-sm font-medium tracking-wide text-white px-4 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Reservations Table */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <ClipLoader size={50} color="#3498db" />
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredReservations}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage) => setPageSize(newPerPage)}
                />
            )}

            {/* Modal for Create and Edit */}
            <Modal isOpen={isCreateModalOpen || isEditModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal">
                <div className="modal-container">
                    <h2 className="text-2xl mb-4">
                        {isEditModalOpen ? "Edit Reservation" : "Create Reservation"}
                    </h2>
                    {/* Form Inputs for Reservation */}
                    {/* (Form elements would go here, similar to how they were in the Branch component) */}
                </div>
            </Modal>
        </div>
    );
};

export default Reservation;
