'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import AsyncSelectComponent from "@/components/Forms/AsycSelect";
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";
import TextInput from "@/components/Forms/TextInput";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Select from "@/components/Forms/Select";

interface Option {
    id: string;
    name: string;
}

interface UserCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    type: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    roleId: string;
    branchId: string;
}

const UserCreate: React.FC<UserCreateProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        type: "",
        username: "",
        name: "",
        email: "",
        phone: "",
        roleId: "",
        branchId: "",
    });

    const [roles, setRoles] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>(null);
    const [branch, setBranch] = useState("");
    const [area, setArea] = useState("");
    const [region, setRegion] = useState("");
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [regionOptions, setRegionOptions] = useState<any[]>([]);

    useEffect(() => {
        const loadRegions = async () => {
            setBranch('');
            setArea('');
            const type = 'REGION';

            const queryParams = new URLSearchParams({
                type
            });

            try {
                const response = await fetch(`/api/branches?${queryParams.toString()}`);
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
        const loadAreas = async () => {
            if (!region) return;

            setBranch('');

            try {
                const response = await fetch(`/api/branches?type=AREA&regionId=${region}`);
                const result = await response.json();

                if (result.success) {
                    setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        loadAreas();
    }, [region]);

    useEffect(() => {
        const loadBranches = async () => {
            if (!region && !area) return;

            try {
                const response = await fetch(`/api/branches?type=BRANCH&areaCode=${area}&size=500`);
                const result = await response.json();

                if (result.success) {
                    setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching branches:', err);
            }
        };

        loadBranches();
    }, [area]);

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

    useEffect(() => {
        setFormData({
            ...formData,
            branchId: branch
        });
    }, [branch]);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);
            setFormData({ ...formData, username: formData.email });

            const response = await fetch(`/api/access/users`, {
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
                toast.success('User successfully added');
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
            title="Buat Pengguna Baru"
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
                        onChange={(value) => setFormData({ ...formData, type: String(value) })}
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
                        label="Region"
                        options={regionOptions}
                        value={region}
                        onChange={(value) => setRegion(value as string)}
                        placeholder="Pilih wilayah penempatan"
                    />
                    {(region && formData.type != 'REGION') && (
                        <Select
                            size="sm"
                            label="Area"
                            options={areaOptions}
                            value={area}
                            onChange={(value) => setArea(value as string)}
                            disabled={region === ''}
                            placeholder="Pilih area sesuai wilayah"
                        />
                    )}
                    {(area && formData.type != 'AREA' && formData.type != 'REGION') && (
                        <Select
                            size="sm"
                            label="Cabang"
                            options={branchOptions}
                            value={branch}
                            onChange={(value) => setBranch(value as string)}
                            disabled={area === ''}
                            placeholder="Pilih cabang sesuai area"
                        />
                    )}
                </div>
            </div>
        </ModalForm>
    );
};

export default UserCreate;
