"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const DataTable = dynamic(() => import("react-data-table-component"), {
    ssr: false,
});

interface ServiceTypeItem {
    id: number;
    name: string;
    code: string;
    rsvCode: string;
    productCode: string;
    prefix: string;
    slaMinDuration: string;
    slaMaxDuration: string;
    parentId: number;
    formFields: string | null;
}

interface Errors {
    name?: string;
    code?: string; // Untuk Service Code
    rsvCode?: string; // Untuk RSV Code
    formFields?: string; // Untuk Form Fields
    prefix?: string; // Untuk Prefix
    productCode?: string; // Untuk Product Code
    parentId?: string; // Untuk Parent ID
    slaMinDuration?: string; // Untuk SLA Min Duration
    slaMaxDuration?: string; // Untuk SLA Max Duration
}


const ServicesTypes: React.FC = () => {
    const [search, setSearch] = useState("");
    const [servicesData, setServicesData] = useState<ServiceTypeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editData, setEditData] = useState<ServiceTypeItem | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [statusMessage, setStatusMessage] = useState("");

    const [newService, setNewService] = useState<{
        code: string;
        rsvCode: string;
        productCode: string;
        name: string;
        prefix: string;
        slaMinDuration: string;
        slaMaxDuration: string;
        parentId: string;
        formFields: string | null;
    }>({
        code: "",
        rsvCode: "",
        productCode: "",
        name: "",
        prefix: "",
        slaMinDuration: "",
        slaMaxDuration: "",
        parentId: "",
        formFields: null,
    });


    type TextAlign = "left" | "center" | "right";
    const { data: session, status } = useSession();
    const [currentItem, setCurrentItem] = useState<ServiceTypeItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleEditClick = (row: ServiceTypeItem) => {
        setCurrentItem(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/master/services-types");
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setServicesData(data.data);
            } else {
                setError("Invalid data format or failed to fetch data.");
            }
        } catch {
            setError("Error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchChecklistDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/master/services-types/${id}`);
            if (!response.ok) throw new Error("Failed to fetch services types detail.");
            const result = await response.json();

            if (result.success) {
                setCurrentItem(result.data);
                setIsDetailModalOpen(true);
            } else {
                alert(result.message || "Unknown error");
            }
        } catch (err: any) {
            alert(err.message || "Error occurred while fetching services types detail.");
        } finally {
            setLoading(false);
        }
    };


    const handleCreate = async () => {
        if (!handleValidation()) {
            console.log("Validation failed");
            return;
        }
        try {
            // const requestBody = {
            //     code: newService.code,
            //     rsvCode: newService.rsvCode,
            //     productCode: newService.productCode,
            //     name: newService.name,
            //     prefix: newService.prefix,
            //     slaMinDuration: newService.slaMinDuration,
            //     slaMaxDuration: newService.slaMaxDuration,
            //     parentId: newService.parentId,
            //     formFields: newService.formFields,
            // };

            const requestBody = {
                code: newService.code,
                rsvCode: newService.rsvCode,
                productCode: newService.productCode,
                name: newService.name,
                prefix: newService.prefix,
                slaMinDuration: Number(newService.slaMinDuration), // Convert to number
                slaMaxDuration: Number(newService.slaMaxDuration), // Convert to number
                parentId: Number(newService.parentId), // Convert to number
                formFields: newService.formFields,
            };


            const response = await fetch("/api/master/services-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Service type created:", data);

                setIsCreateModalOpen(false);
                setNewService({
                    code: "",
                    rsvCode: "",
                    productCode: "",
                    name: "",
                    prefix: "",
                    slaMinDuration: "",
                    slaMaxDuration: "",
                    parentId: "",
                    formFields: null,
                });
                fetchData();
                setStatusMessage("Service type created successfully!");
            } else {
                console.error("Failed to create service type.");
                setStatusMessage("Failed to create service type.");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatusMessage("Error occurred while creating service type. Please try again.");
        }
    };


    const handleValidation = () => {
        const newErrors: Errors = {};

        let valid = true;

        // Validate Service Name
        if (!newService.name?.trim()) {
            newErrors.name = "Service Type Name is required.";
            valid = false;
        } else if (newService.name !== newService.name.toUpperCase()) {
            newErrors.name = "Service Type Name must be in uppercase.";
            valid = false;
        }

        // Validate Service Code
        if (!newService.code?.trim()) {
            newErrors.code = "Service Code is required.";
            valid = false;
        }

        // Validate Prefix
        if (!newService.prefix?.trim()) {
            newErrors.prefix = "Prefix is required.";
            valid = false;
        }

        // Validate Product Code
        if (!newService.productCode?.trim()) {
            newErrors.productCode = "Product Code is required.";
            valid = false;
        }

        // Validate Parent ID
        if (!newService.parentId?.trim()) {
            newErrors.parentId = "Parent ID Code is required.";
            valid = false;
        }

        // Validate RSV Code
        if (!newService.rsvCode?.trim()) {
            newErrors.rsvCode = "RSV Code is required.";
            valid = false;
        }

        // Validate SLA Min Duration
        if (!newService.slaMinDuration) {
            newErrors.slaMinDuration = "SLA Min Duration is required.";
            valid = false;
        }

        // Validate SLA Max Duration
        if (!newService.slaMaxDuration) {
            newErrors.slaMaxDuration = "SLA Max Duration is required.";
            valid = false;
        }

        // // Validate Form Fields
        // if (!newService.formFields) {
        //     newErrors.formFields = "Form Fields is required.";
        //     valid = false;
        // }

        setErrors(newErrors);

        return valid;
    };



    useEffect(() => {
        fetchData();
    }, [session, status]);

    const filteredData = useMemo(() => {
        const searchTerm = search.toLowerCase();
        return servicesData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm)
        );
    }, [search, servicesData]);


    const columns = [
        {
            name: "No.",
            selector: (_: ServiceTypeItem, index: number) => index + 1,
            sortable: true,
            maxWidth: "1px",
            minWidth: "70px",
        },

        {
            name: "Service Type",
            selector: (row: ServiceTypeItem) => row.name,
            sortable: true,
            minWidth: "50px",
            grow: 1,
        },
        {
            name: "Actions",
            right: "true",
            cell: (row: ServiceTypeItem) => (
                <div className="flex border border-gray-400 rounded divide-x divide-gray-400">
                    <button
                        onClick={() => fetchChecklistDetail(row.id)}
                        className="text-blue-500 hover:text-blue-700 p-1.5"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleEditClick(row)}
                        className="text-green-500 hover:underline flex items-center space-x-1 text-sm sm:px-2 py-1 w-full sm:w-auto"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-500 hover:underline flex items-center space-x-1 text-sm sm:px-2 py-1 w-full sm:w-auto"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        }
    ];

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const response = await fetch(`/api/master/service-types/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setServicesData((prevData) =>
                        prevData.filter((item) => item.id !== id)
                    );
                } else {
                    alert("Failed to delete item.");
                }
            } catch {
                alert("Error occurred while deleting item.");
            }
        }
    };

    const handleSave = async () => {
        if (!currentItem) return;

        try {
            const response = await fetch(`/api/master/service-types/${currentItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentItem),
            });

            if (response.ok) {
                fetchData();
                setIsModalOpen(false);
            } else {
                alert("Failed to update item.");
            }
        } catch {
            alert("Error occurred while saving item.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-left">Service Types</h1>

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
                        className="bg-teal-500 font-medium tracking-wide text-white px-4 py-2 rounded-md"
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

            {/* Create */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                contentLabel="Create Service Type"
                className="modal-service-types"
            >
                <h2 className="text-xl font-bold mb-4">Create Service Type</h2>

                {/* Input Container */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Service Name Input */}
                    <div>
                        <label htmlFor="serviceName" className="block font-medium text-gray-700 mb-1">
                            Service Type Name
                        </label>
                        <input
                            id="serviceName"
                            type="text"
                            placeholder="Enter service type name"
                            value={newService.name || ""}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Service Code Input */}
                    <div>
                        <label htmlFor="serviceCode" className="block font-medium text-gray-700 mb-1">
                            Service Code
                        </label>
                        <input
                            id="serviceCode"
                            type="text"
                            placeholder="Enter service code"
                            value={newService.code || ""}
                            onChange={(e) => setNewService({ ...newService, code: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.code ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                        )}
                    </div>

                    {/* RSV Code Input */}
                    <div>
                        <label htmlFor="rsvCode" className="block font-medium text-gray-700 mb-1">
                            RSV Code
                        </label>
                        <input
                            id="rsvCode"
                            type="text"
                            placeholder="Enter RSV code"
                            value={newService.rsvCode || ""}
                            onChange={(e) => setNewService({ ...newService, rsvCode: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.rsvCode ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.rsvCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.rsvCode}</p>
                        )}
                    </div>

                    {/* Prefix Input */}
                    <div>
                        <label htmlFor="prefix" className="block font-medium text-gray-700 mb-1">
                            Prefix
                        </label>
                        <input
                            id="prefix"
                            type="text"
                            placeholder="Enter prefix"
                            value={newService.prefix || ""}
                            onChange={(e) => setNewService({ ...newService, prefix: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.prefix ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.prefix && <p className="text-red-500 text-sm mt-1">{errors.prefix}</p>}
                    </div>

                    {/* Product Code Input */}
                    <div>
                        <label htmlFor="productCode" className="block font-medium text-gray-700 mb-1">
                            Product Code
                        </label>
                        <input
                            id="productCode"
                            type="text"
                            placeholder="Enter product code"
                            value={newService.productCode || ""}
                            onChange={(e) => setNewService({ ...newService, productCode: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.productCode ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.productCode && <p className="text-red-500 text-sm mt-1">{errors.productCode}</p>}
                    </div>

                    {/* Parent ID Input */}
                    {/* <div>
                        <label htmlFor="parentId" className="block font-medium text-gray-700 mb-1">
                            Parent ID
                        </label>
                        <input
                            id="parentId"
                            type="number"
                            placeholder="Enter parent ID"
                            value={newService.parentId || ""}
                            onChange={(e) => setNewService({ ...newService, parentId: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.parentId ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
                    </div> */}

                    {/* Parent ID Input */}
                    <div>
                        <label htmlFor="parentId" className="block font-medium text-gray-700 mb-1">
                            Parent ID
                        </label>
                        <input
                            id="parentId"
                            type="number"
                            placeholder="Enter parent ID"
                            value={newService.parentId || ""}
                            onChange={(e) => setNewService({ ...newService, parentId: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.parentId ? "border-red-500" : "border-gray-300"}`}
                            min="1" // Add min value if applicable
                        />
                        {errors.parentId && <p className="text-red-500 text-sm mt-1">{errors.parentId}</p>}
                    </div>

                    {/* SLA Min Duration Input */}
                    <div>
                        <label htmlFor="slaMinDuration" className="block font-medium text-gray-700 mb-1">
                            SLA Min Duration
                        </label>
                        <input
                            id="slaMinDuration"
                            type="number"
                            placeholder="Enter SLA Min Duration"
                            value={newService.slaMinDuration || ""}
                            onChange={(e) => setNewService({ ...newService, slaMinDuration: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.slaMinDuration ? "border-red-500" : "border-gray-300"}`}
                            min="0" // Add min value if applicable
                        />
                        {errors.slaMinDuration && (
                            <p className="text-red-500 text-sm mt-1">{errors.slaMinDuration}</p>
                        )}
                    </div>

                    {/* SLA Max Duration Input */}
                    <div>
                        <label htmlFor="slaMaxDuration" className="block font-medium text-gray-700 mb-1">
                            SLA Max Duration
                        </label>
                        <input
                            id="slaMaxDuration"
                            type="number"
                            placeholder="Enter SLA Max Duration"
                            value={newService.slaMaxDuration || ""}
                            onChange={(e) => setNewService({ ...newService, slaMaxDuration: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.slaMaxDuration ? "border-red-500" : "border-gray-300"}`}
                            min="0" // Add min value if applicable
                        />
                        {errors.slaMaxDuration && (
                            <p className="text-red-500 text-sm mt-1">{errors.slaMaxDuration}</p>
                        )}
                    </div>

                    {/* Form Fields Input */}
                    <div>
                        <label htmlFor="formFields" className="block font-medium text-gray-700 mb-1">
                            Form Fields
                        </label>
                        <textarea
                            id="formFields"
                            placeholder="Enter form fields as JSON"
                            value={newService.formFields || ""}
                            onChange={(e) => setNewService({ ...newService, formFields: e.target.value })}
                            className={`border px-4 py-2 rounded-md w-full ${errors.formFields ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.formFields && <p className="text-red-500 text-sm mt-1">{errors.formFields}</p>}
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                        Create
                    </button>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Edit Service Type"
                className="modal"
            >
                {currentItem && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Edit Service Type</h2>
                        <input
                            type="text"
                            value={currentItem.name}
                            onChange={(e) =>
                                setCurrentItem({
                                    ...currentItem,
                                    name: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                className="bg-white rounded-lg p-6 w-3/4 max-w-lg shadow-lg"
            >
                <div className="modal-header flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-center">Service Type Detail</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>

                {currentItem ? (
                    <div className="grid gap-4">
                        <div>
                            <div className="text-gray-500">Name</div>
                            <div className="mt-1 mb-3 font-medium">{currentItem.name || "N/A"}</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">Loading...</p>
                )}
            </Modal>
        </div>
    );
};

export default ServicesTypes;
