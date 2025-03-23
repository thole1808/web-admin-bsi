'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";
import Select from "@/components/Forms/Select";

interface Option {
    id: string;
    name: string;
}

interface RoleCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    code: string;
    name: string;
    guardName: string;
    permissions: string[];
}

const RoleCreate: React.FC<RoleCreateProps> = ({ isOpen, onClose }) => {
    const [permissionData, setPermissionData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/access/permissions`);
                const result = await response.json();

                if (result.success) {
                    setPermissionData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch roles");
                }
            } catch (err) {
                console.error('Error fetching roles:', err);
            }
        };

        fetchData();
    }, [isOpen]);

    const [formData, setFormData] = useState<FormData>({
        code: "",
        name: "",
        guardName: "",
        permissions: [],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const inputStyles = 'block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6';

    useEffect(() => {
        setFormData({
            ...formData,
        });
    }, [permissionData]);

    const handleCheckboxChange = (name: string) => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.includes(name)
                ? prevData.permissions.filter((perm) => perm !== name)
                : [...prevData.permissions, name],
        }));
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/access/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(JSON.parse(result.error).data);
            } else if (result.success) {
                toast.success('Role successfully added');
                onClose();
            } else {
                toast.error(result.message || "A system error has occurred. Please try again later.");
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ModalForm
            width="lg"
            title="Create Role"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <Label htmlFor="code" required>Kode</Label>
                <input
                    type="text"
                    id="code"
                    placeholder="Kode"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-sm mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="name" required>Role</Label>
                <input
                    type="text"
                    id="name"
                    placeholder="Role"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-sm mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Select
                    label="Guard"
                    options={[
                        { value: 'api', label: 'Caller' },
                        { value: 'admin', label: 'Webadmin' },
                    ]}
                    value={formData.guardName}
                    onChange={(value) => setFormData({ ...formData, guardName: String(value) })}
                    placeholder="Select an option"
                    error={errors?.guardName}
                    required
                />
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="permissions" required>Permissions</Label>
                <div className="grid grid-cols-3 gap-3">
                    {permissionData.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 border p-2 rounded">
                            <label htmlFor={item.id} className="block font-medium text-gray-700">
                                {item.name}
                            </label>
                            <input
                                type="checkbox"
                                id={item.id}
                                name={item.id}
                                checked={formData.permissions.includes(item.name)} // Check the state for the current checkbox
                                onChange={() => handleCheckboxChange(item.name)} // Toggle the checkbox state on change
                                className="w-4 h-4 text-blue-500 border border-gray-300 rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ModalForm>
    );
};

export default RoleCreate;
