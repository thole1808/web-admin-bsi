"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
// import BranchOfficeHourCreate from "./BranchOfficeHourCreate";
// import BranchOfficeHourDelete from "./BranchOfficeHourDelete";
// import BranchOfficeHourEdit from "./BranchOfficeHourEdit";
import ExportCSV from "@/components/Button/ExportCsvButton";
import TextInput from "@/components/Forms/TextInput";
import ResetButton from "@/components/Button/ResetButton";
import { useParams } from "next/navigation";
import ModalForm from "../Tables/ModalForm";
import Select from 'react-select'
import TimePicker from "../Forms/TimePicker";

interface FormData {
    days: string[];
    timeOpen: string;
    timeClosed: string;
}

const BranchOfficeHourList: React.FC = () => {
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState("POST");
    const [formOpen, setFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const params = useParams();
    const id = params?.id;
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState<FormData>({
        days: [],
        timeOpen: "",
        timeClosed: "",
    });

    useEffect(() => {
        console.log("branchId", id);
        if (!id) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/branches/${id}/office-hours`);
                const result = await response.json();

                if (result.success) {
                    setOriginalData(result.data);
                    setFilteredData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!isEdit && !isDelete) {
            fetchData();
        }
    }, [isEdit, isDelete]);

    const columns = [
        {
            name: "Days",
            selector: (row: { days: any }) => row?.days || "",
            grow: 3
        },
        {
            name: "Time Open",
            selector: (row: { timeOpen: string }) => row?.timeOpen || "",
        },
        {
            name: "Time Closed",
            selector: (row: { timeClosed: string }) => row?.timeClosed || "",
        },
        {
            name: "",
            right: true,
            cell: (row: any) => (
                <ActionGroup
                    options={[
                        { label: "Edit", icon: "edit", action: () => openEdit(row) },
                        { label: "Delete", icon: "trash", action: () => handleDelete(row) },
                    ]}
                />
            ),
        },
    ];

    const openEdit = (row: any) => {
        setSelectedRow(row);
        setIsEdit(true);
    };

    const closeEdit = () => {
        setIsEdit(false);
        setSelectedRow(null);
    };

    const handleDelete = (row: any) => {
        setSelectedRow(row);
        setIsDelete(true);
    };

    const closeDelete = () => {
        setIsDelete(false);
        setSelectedRow(null);
    };

    const handleFormOpen = (method: string) => {
        setMethod(method);
        setFormOpen(true);
    };

    const handleSubmit = (formData: FormData) => {
        setIsProcessing(true);
        console.log("formData", formData);
    }

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-2 border-b flex justify-between items-center">
                    <h2 className="text-md font-semibold ml-2 text-gray-700">Office Hours</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={() => handleFormOpen('POST')} />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={loading}
                    progressComponent={<CustomLoader />}
                    pagination
                />
            </div>

            {formOpen && (
                <ModalForm
                    width="lg"
                    title="Create Cabin Check"
                    isOpen={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                >
                    <div className="mb-4 text-sm">
                        <Select
                            options={[
                                { value: '1', label: 'Monday' },
                                { value: '2', label: 'Tuesday' },
                                { value: '3', label: 'Wednesday' },
                                { value: '4', label: 'Thursday' },
                                { value: '5', label: 'Friday' },
                                { value: '6', label: 'Saturday' },
                                { value: '7', label: 'Sunday' },
                            ]}
                            value={formData.days.map(day => ({ value: day, label: day }))}
                            onChange={(selectedOptions) => setFormData({ ...formData, days: Array.isArray(selectedOptions) ? selectedOptions.map((option: { value: string }) => option.value) : [] })}
                            placeholder="Select an option"
                            isMulti
                            required
                        />
                    </div>
                    <div className="mb-4 text-sm">
                    </div>

                </ModalForm>
            )}

        </div>
    );
};

export default BranchOfficeHourList;
