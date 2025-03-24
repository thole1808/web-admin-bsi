'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";
import Select from "@/components/Forms/Select";

interface RoleEditProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    code: string;
    name: string;
    guardName: string;
    permissions: string[];
}

const RoleEdit: React.FC<RoleEditProps> = ({ isOpen, onClose, data }) => {
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
        code: data.code,
        name: data.name,
        guardName: data.guardName,
        permissions: data.permissions.map((perm: any) => perm.name),
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
        console.log(JSON.stringify(formData));
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/access/roles/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(JSON.parse(result.error).data);
            } else if (result.success) {
                toast.success('Role successfully updated');
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
            width="2xl"
            title="Edit Role"
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
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(
                        permissionData.reduce((acc: any, perm: any) => {
                            const [prefix] = perm.name.split(":");
                            if (!acc[prefix]) acc[prefix] = [];
                            acc[prefix].push(perm);
                            return acc;
                        }, {})
                    ).map(([group, items]: [string, any[]]) => (
                        <div key={group}>
                            <h3 className="text-teal-700 font-semibold mb-2 capitalize">{group} permissions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-2 border p-2 rounded shadow-sm bg-gray-50">
                                        <label htmlFor={item.id} className="text-gray-800 text-sm truncate w-full">
                                            {item.name}
                                        </label>
                                        <input
                                            type="checkbox"
                                            id={item.id}
                                            name={item.id}
                                            checked={formData.permissions.includes(item.name)}
                                            onChange={() => handleCheckboxChange(item.name)}
                                            className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ModalForm>
    );
};

export default RoleEdit;
