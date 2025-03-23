"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import CreateButton from "@/components/Button/CreateButton";
import { useParams } from "next/navigation";
import ModalForm from "../../Tables/ModalForm";
import Select from 'react-select'
import CustomSelect from "../../Forms/Select";
import Label from "../../Forms/Label";
import { toast } from 'react-toastify';
import TextInput from "../../Forms/TextInput";

interface FormData {
    name: string;
    num: number;
    serviceTypes: string[];
}

const BranchCountersList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState("POST");
    const [formOpen, setFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [options, setOptions] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    const params = useParams();
    const id = params?.id;
    const [formData, setFormData] = useState<FormData>({
        name: "",
        num: 0,
        serviceTypes: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/master/service-types`);
                const result = await response.json();

                if (result.success) {
                    setOptions(result.data.map((item: any) => ({ value: item.id, label: item.name })));
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch(`/api/access/roles`);
                const result = await response.json();

                if (result.success) {
                    setRoles(result.data.content
                        .filter((item: any) => item.guardName === 'api')
                        .map((item: any) => ({ value: item.name, label: item.name }))
                    );
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
            }
        }

        fetchRoles();
        fetchData();
    }, []);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/branches/${id}/counters`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                    setFormData({
                        ...formData,
                        num: result.data.length + 1
                    })
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
            name: "Name",
            selector: (row: { name: string }) => row?.name || "",
            grow: 2,
        },
        {
            name: "Number",
            selector: (row: { num: number }) => row?.num || "",
        },
        {
            name: "Services",
            selector: (row: { serviceTypes: any }) => row?.serviceTypes.map((i: any) => i.name).join(", ") || "",
            maxWidth: "600px",
            grow: 3,
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

    const openEdit = (row: any) => {
        setSelectedRow(row);
        setMethod('PUT');
        setFormOpen(true);

        console.log(row);
        setFormData({
            name: row.name,
            num: row.num,
            serviceTypes: row.serviceTypes.map((service: any) => service.name),
        });

        console.log(formData);
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
        const mappedDays = formData.serviceTypes.map((day) => {
            return options.find((option) => option.label === day)?.value || "";
        });

        try {
            setIsProcessing(true);
            let status = 'added';
            let url = `/api/branches/${id}/counters`;

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
                    serviceTypes: mappedDays
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
                    serviceTypes: [],
                    name: "",
                    num: 0
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
            <div className="grid border rounded-lg bg-gray-50 overflow-hidden z-1">
                <div className="p-2 border-b flex justify-between items-center">
                    <h2 className="text-md font-semibold ml-2 text-gray-600">Counters</h2>
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
                        <CustomSelect
                            label="Role"
                            options={roles}
                            value={formData.name}
                            onChange={(value: string) => setFormData({ ...formData, name: value })}
                            placeholder="Select an option"
                            required
                        />
                    </div>
                    <div className="mb-4 text-sm">
                        <TextInput
                            label="Number"
                            type="number"
                            placeholder="Counter Number"
                            value={formData.num.toFixed(0)}
                            onChange={(value) => setFormData({ ...formData, num: Number(value) })}
                            error={errors?.name}
                            required
                        />
                    </div>
                    <div className="mb-4 text-sm">
                        <Label htmlFor="serviceTypes" required>Service Types</Label>
                        <Select
                            id="serviceTypes"
                            options={options}
                            value={formData.serviceTypes.map(item => ({ value: item, label: item }))}
                            onChange={(selectedOptions) => setFormData({ ...formData, serviceTypes: Array.isArray(selectedOptions) ? selectedOptions.map((option: { label: string }) => option.label) : [] })}
                            placeholder="Select an option"
                            isMulti
                            required
                        />
                        {errors?.serviceTypes && <p className="text-red-500 text-sm mt-1">{errors?.serviceTypes}</p>}
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
                        Are you sure you want to delete <strong className="underline">{selectedRow?.name}</strong> from the counters list?
                    </div>
                </ModalForm>
            )}

        </div>
    );
};

export default BranchCountersList;
