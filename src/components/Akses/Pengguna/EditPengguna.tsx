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

interface EditPenggunaProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    roleId: string;
    branchId: string;
}

const EditPengguna: React.FC<EditPenggunaProps> = ({ isOpen, onClose, data }) => {
    interface Role {
        id: string;
        name: string;
    }

    interface Branch {
        id: string;
        name: string;
    }

    const [role, setRole] = useState<Role>({
        id: data?.role?.id,
        name: data?.role?.name
    });

    const [branch, setBranch] = useState<Branch>({
        id: data?.branch?.id,
        name: data?.branch?.name
    });

    const [formData, setFormData] = useState<FormData>({
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleId: data?.role?.id,
        branchId: data?.branch?.id,
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const inputStyles = 'block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6';

    useEffect(() => {
        setFormData({
            ...formData,
            roleId: role.id,
            branchId: branch.id
        });
    }, [role, branch]);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/akses/pengguna/${data.id}`, {
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
                toast.success('Pengguna berhasil diperbarui');
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
            title="Edit Pengguna"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <Label htmlFor="username" required>Username</Label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={inputStyles + ` bg-gray-200`}
                    disabled
                />
                {errors?.username && <p className="text-red-500 text-xs mt-1">{errors?.username}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="name" required>Nama</Label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="email" required>Email</Label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputStyles}
                />
                {errors?.email && <p className="text-red-500 text-xs mt-1">{errors?.email}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="phone" required>No. Telepon</Label>
                <input
                    type="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputStyles}
                />
                {errors?.phone && <p className="text-red-500 text-xs mt-1">{errors?.phone}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="role" required>Peran</Label>
                <AsyncSelectComponent optionLabel="name" optionValue="id" value={role} onChange={(selectedOption) => setRole(selectedOption as Role)} loadOptions={async () => {
                    const response = await fetch(`/api/akses/peran`);
                    const result = await response.json();

                    if (result.success) {
                        return result.data;
                    } else {
                        throw new Error(result.message || "Failed to fetch roles");
                    }
                }
                } />
                {errors?.roleId && <p className="text-red-500 text-xs mt-1">{errors?.roleId}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="branchId">Cabang</Label>
                <AsyncSelectComponent optionLabel="name" optionValue="id" value={branch} onChange={(selectedOption) => setBranch(selectedOption as Branch)} loadOptions={debounce(async (inputValue: string) => {
                    const response = await fetch(`/api/branches/branch?name=${inputValue}`);
                    const result = await response.json();

                    if (result.success) {
                        return result.data.content;
                    } else {
                        throw new Error(result.message || "Failed to fetch branches");
                    }
                }, 500) as (inputValue: string) => Promise<Option[]>} />
                {errors?.cabangId && <p className="text-red-500 text-xs mt-1">{errors?.cabangId}</p>}
            </div>
        </ModalForm>
    );
};

export default EditPengguna;
