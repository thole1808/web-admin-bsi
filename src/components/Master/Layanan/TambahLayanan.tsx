'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import AsyncSelectComponent from "@/components/Select/AsycSelect";
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";

interface Option {
    id: string;
    name: string;
}

interface TambahLayananProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    code: string;
    name: string;
    guardName: string;
    permissions: string[];
}

const TambahLayanan: React.FC<TambahLayananProps> = ({ isOpen, onClose }) => {
    const [permissionData, setPermissionData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/akses/hak-akses`);
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

            const response = await fetch(`/api/master/layanan`, {
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
                toast.success('Layanan berhasil ditambahkan');
                onClose();
            } else {
                toast.error(result.message || "Terjadi kendala sistem. Harap ulangi beberapa saat lagi.");
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
            title="Tambah Layanan"
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
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="name" required>Layanan</Label>
                <input
                    type="text"
                    id="name"
                    placeholder="Layanan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="guardName" required>Guard</Label>
                <input
                    type="text"
                    id="guardName"
                    placeholder="Guard"
                    value={formData.guardName}
                    onChange={(e) => setFormData({ ...formData, guardName: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="permissions" required>Permissions</Label>
                <div className="grid grid-cols-3 gap-3">
                    {permissionData.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 border p-2 rounded">
                            <label htmlFor={item.id} className="block text-sm font-medium text-gray-700">
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

export default TambahLayanan;
