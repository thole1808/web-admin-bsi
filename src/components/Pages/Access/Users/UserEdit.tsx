'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import Select from "@/components/Forms/Select";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import TextInput from "@/components/Forms/TextInput";

interface UserEditProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    id: string;
    type: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    roleId: string;
    branchId: string;
    areaId: string;
    regionId: string;
}

const UserEdit: React.FC<UserEditProps> = ({ isOpen, onClose, data }) => {
    const [formData, setFormData] = useState<FormData>({
        id: data.id,
        username: data.username,
        type: data?.branch?.type || "",
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleId: data?.role?.id || "",
        branchId: data?.branch?.id || "",
        areaId: data?.branch?.areaId || "",
        regionId: data?.branch?.regionId || "",
    });

    const [roles, setRoles] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [regionOptions, setRegionOptions] = useState<any[]>([]);

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const response = await fetch(`/api/branches?type=BRANCH&areaId=${formData.areaId}&size=500`);
                const result = await response.json();

                if (result.success) {
                    setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching branches:', err);
            }
        };

        loadBranches();
    }, [formData.areaId]);

    useEffect(() => {
        const loadAreas = async () => {
            setFormData({
                ...formData,
                branchId: '',
            });

            try {
                const response = await fetch(`/api/branches?type=AREA&regionId=${formData.regionId}`);
                const result = await response.json();

                if (result.success) {
                    setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        loadAreas();
    }, [formData.regionId]);

    useEffect(() => {
        const loadRegions = async () => {
            setFormData({
                ...formData,
                areaId: '',
            });

            setFormData({
                ...formData,
                branchId: '',
            });

            try {
                const response = await fetch(`/api/branches?type=REGION&size=100`);
                const result = await response.json();

                if (result.success) {
                    setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching regions:', err);
            }
        };

        loadRegions();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/access/roles`);
                const result = await response.json();

                if (result.success) {
                    setRoles(result.data.content.map((role: any) => ({ value: role.id, label: role.name })));
                } else {
                    toast.error(result.message || "Failed to fetch roles");
                }
            } catch (err) {
                console.error('Error fetching roles:', err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/access/users/${data.id}`, {
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
                toast.success('User successfully updated');
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
            width="4xl"
            title="Edit Pengguna"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            {/* Informasi Akun */}
            <div className="mb-6">
                <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-white">Informasi Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Jenis Pengguna"
                        options={[
                            { value: 'REGION', label: 'Region' },
                            { value: 'AREA', label: 'Area' },
                            { value: 'BRANCH', label: 'Cabang' },
                        ]}
                        value={formData.type}
                        onChange={(value) => {
                            const type = String(value);
                            const reset = { areaId: '', branchId: '' };
                            setFormData({ ...formData, type, ...(type === 'REGION' ? reset : type === 'AREA' ? { branchId: '' } : {}) });
                        }}
                        placeholder="Pilih jenis pengguna"
                        required
                    />
                    <Select
                        label="Peran"
                        options={roles}
                        value={formData.roleId}
                        onChange={(value) => setFormData({ ...formData, roleId: String(value) })}
                        placeholder="Pilih peran pengguna"
                        required
                    />
                    <TextInput
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap pengguna"
                        value={formData.name}
                        onChange={(value) => setFormData({ ...formData, name: value })}
                        required
                        error={errors?.name}
                    />
                    <TextInput
                        label="Email"
                        placeholder="contoh: pengguna@email.com"
                        value={formData.email}
                        onChange={(value) => setFormData({ ...formData, email: value })}
                        required
                        error={errors?.email}
                        prefixIcon={<FaEnvelope />}
                    />
                    <TextInput
                        label="No. Telepon"
                        placeholder="Masukkan nomor telepon aktif"
                        value={formData.phone}
                        onChange={(value) => setFormData({ ...formData, phone: value })}
                        required
                        error={errors?.phone}
                        prefixIcon={<FaPhone />}
                    />
                </div>
            </div>

            {/* Penempatan */}
            <div className="mb-2">
                <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-white">Penempatan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        size="sm"
                        label="Wilayah"
                        options={regionOptions}
                        value={formData.regionId}
                        onChange={(value) => setFormData({ ...formData, regionId: String(value) })}
                        placeholder="Pilih wilayah penempatan"
                    />
                    {(formData.type === 'AREA' || formData.type === 'BRANCH') && (
                        <Select
                            size="sm"
                            label="Area"
                            options={areaOptions}
                            value={formData.areaId}
                            onChange={(value) => setFormData({ ...formData, areaId: String(value) })}
                            disabled={!formData.regionId}
                            placeholder="Pilih area sesuai wilayah"
                        />
                    )}
                    {formData.type === 'BRANCH' && (
                        <Select
                            size="sm"
                            label="Cabang"
                            options={branchOptions}
                            value={formData.branchId}
                            onChange={(value) => setFormData({ ...formData, branchId: String(value) })}
                            disabled={!formData.areaId}
                            placeholder="Pilih cabang sesuai area"
                        />
                    )}
                </div>
            </div>
        </ModalForm>
    );
};

export default UserEdit;
