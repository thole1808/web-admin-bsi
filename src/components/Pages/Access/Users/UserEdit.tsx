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
    areaCode: string;
    regionCode: string;
}

const UserEdit: React.FC<UserEditProps> = ({ isOpen, onClose, data }) => {
    const [formData, setFormData] = useState<FormData>({
        id: data.id,
        username: data.username,
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleId: data?.role?.id,
        branchId: data?.branch?.id,
        areaCode: data?.areaCode,
        regionCode: data?.regionCode,
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
                const response = await fetch(`/api/branches?type=BRANCH&areaCode=${formData.areaCode}&size=500`);
                const result = await response.json();

                if (result.success) {
                    setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching branches:', err);
            }
        };

        loadBranches();
    }, [formData.areaCode]);

    useEffect(() => {
        const loadAreas = async () => {
            setFormData({
                ...formData,
                branchId: '',
            });

            try {
                const response = await fetch(`/api/branches?type=AREA&regionCode=${formData.regionCode}`);
                const result = await response.json();

                if (result.success) {
                    setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        loadAreas();
    }, [formData.regionCode]);

    useEffect(() => {
        const loadRegions = async () => {
            setFormData({
                ...formData,
                areaCode: '',
            });

            setFormData({
                ...formData,
                branchId: '',
            });

            try {
                const response = await fetch(`/api/branches?type=REGION&size=100`);
                const result = await response.json();

                if (result.success) {
                    setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
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
            width="lg"
            title="Edit User"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <Select
                    label="User Type"
                    options={[
                        { value: 'REGION', label: 'Region' },
                        { value: 'AREA', label: 'Area' },
                        { value: 'BRANCH', label: 'Branch' },
                    ]}
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: String(value) })}
                    placeholder="Select an option"
                    required
                />
            </div>
            <div className="mb-4 text-sm">
                <TextInput
                    label="Username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(value) => setFormData({ ...formData, username: value })}
                    required
                    error={errors?.username}
                />
            </div>
            <div className="mb-4 text-sm">
                <TextInput
                    label="Name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    required
                    error={errors?.name}
                />
            </div>
            <div className="mb-4 text-sm">
                <TextInput
                    label="Email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    required
                    error={errors?.email}
                    prefixIcon={<FaEnvelope />}
                />
            </div>
            <div className="mb-4 text-sm">
                <TextInput
                    label="Phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    required
                    error={errors?.phone}
                    prefixIcon={<FaPhone />}
                />
            </div>
            <div className="mb-4 text-sm">
                <Select
                    label="Role"
                    options={roles}
                    value={formData.roleId}
                    onChange={(value) => setFormData({ ...formData, roleId: String(value) })}
                    placeholder="Select an option"
                    required
                />
            </div>
            <div className="mb-4 text-sm">
                <Select size="sm" label="Region" options={regionOptions} value={formData.regionCode} onChange={(value) => setFormData({ ...formData, regionCode: String(value) })} />
            </div>
            {formData.type === 'AREA' || formData.type === 'BRANCH' && (
                <div className="mb-4 text-sm">
                    <Select size="sm" label="Area" options={areaOptions} value={formData.areaCode} onChange={(value) => setFormData({ ...formData, areaCode: String(value) })} />
                </div>
            )}
            {formData.type === 'BRANCH' && (
                <div className="mb-4 text-sm">
                    <Select size="sm" label="Branch" options={branchOptions} value={formData.branchId} onChange={(value) => setFormData({ ...formData, branchId: String(value) })} />
                </div>
            )}
        </ModalForm>
    );
};

export default UserEdit;
