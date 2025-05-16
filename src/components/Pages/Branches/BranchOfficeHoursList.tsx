"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import { useParams } from "next/navigation";
import ModalForm from "../../Tables/ModalForm";
import Select from 'react-select'
import TimePicker from "../../Forms/TimePicker";
import Label from "../../Forms/Label";
import { toast } from 'react-toastify';

interface FormData {
    days: string[];
    timeOpen: string;
    timeClosed: string;
}

const BranchOfficeHourList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState("POST");
    const [formOpen, setFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [errors, setErrors] = useState<any>({});

    const params = useParams();
    const id = params?.id;
    const [formData, setFormData] = useState<FormData>({
        days: [],
        timeOpen: "",
        timeClosed: "",
    });

    const options = [
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' },
        { value: '7', label: 'Sunday' },
    ];

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/branches/${id}/office-hours`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!formOpen && !isDelete) {
            fetchData();
        }
    }, [formOpen, isDelete]);

    const columns = [
        {
            name: "Days",
            selector: (row: { days: any }) => row?.days || "",
            grow: 3,
            cell: (row: any) => mapDays(row.days),
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
            right: "true",
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

    const mapDays = (days: number[]) => {
        const mapped = days.map((day) => {
            return options.find((option) => option.value === day.toFixed(0))?.label || "";
        });

        return mapped.join(", ");
    }

    const openEdit = (row: any) => {
        setSelectedRow(row);
        setMethod('PUT');
        setFormOpen(true);

        setFormData({
            days: row.days.map((day: number) => {
                return options.find((option) => option.value === day.toFixed(0))?.label || "";
            }),
            timeOpen: row.timeOpen,
            timeClosed: row.timeClosed,
        });
    };

    const handleDelete = (row: any) => {
        setSelectedRow(row);
        setMethod('DELETE');
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

    const handleSubmit = async (formData: FormData) => {
        const mappedDays = formData.days.map((day) => {
            return options.find((option) => option.label === day)?.value || "";
        });

        try {
            setIsProcessing(true);
            let status = 'added';
            let url = `/api/branches/${id}/office-hours`;

            if (method === 'PUT' || method === 'DELETE') {
                url += `/${selectedRow.id}`;
                status = 'updated';

                if (method === 'DELETE') {
                    status = 'deleted';
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    days: mappedDays
                }),
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(JSON.parse(result.error).data);
            } else if (result.success) {

                toast.success('Office hour successfully ' + status);
                setFormOpen(false);
                setIsDelete(false);
                setFormData({
                    days: [],
                    timeOpen: "",
                    timeClosed: ""
                });

            } else {
                toast.error(result.message || "A system error has occurred. Please try again later.");
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="grid gap-y-4">
            <div className="grid border rounded-lg bg-gray-50 overflow-hidden">
                <div className="p-2 border-b flex justify-between items-center">
                    <h2 className="text-md font-semibold ml-2 text-gray-600">Office Hours</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={() => handleFormOpen('POST')} />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    progressComponent={<CustomLoader />}
                    pagination
                />
            </div>

            {formOpen && (
                <ModalForm
                    width="lg"
                    title="Create Office Hours"
                    isOpen={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                >
                    <div className="mb-4 text-sm">
                        <Label htmlFor="days" required>Days</Label>
                        <Select
                            id="days"
                            options={options}
                            value={formData.days.map(day => ({ value: day, label: day }))}
                            onChange={(selectedOptions) => setFormData({ ...formData, days: Array.isArray(selectedOptions) ? selectedOptions.map((option: { label: string }) => option.label) : [] })}
                            placeholder="Select an option"
                            isMulti
                            required
                        />
                        {errors?.days && <p className="text-red-500 text-sm mt-1">{errors?.days}</p>}
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <TimePicker
                            label="Time Open"
                            value={formData.timeOpen}
                            onChange={(value) => setFormData({...formData, timeOpen: value})}
                            required
                            error={errors?.timeOpen}
                        />
                        <TimePicker
                            label="Time Closed"
                            value={formData.timeClosed}
                            onChange={(value) => setFormData({...formData, timeClosed: value})}
                            required
                            error={errors?.timeClosed}
                        />
                    </div>
                </ModalForm>
            )}

            {isDelete && (
                <ModalForm
                    title="Delete Office Hour"
                    isOpen={isDelete}
                    onClose={closeDelete}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                    isDestructive
                >
                    <div className="text-sm">
                        Are you sure you want to delete <strong className="underline">{mapDays(selectedRow?.days)}</strong> from the office hours list?
                    </div>
                </ModalForm>
            )}

        </div>
    );
};

export default BranchOfficeHourList;
