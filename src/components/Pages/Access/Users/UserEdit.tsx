'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import AsyncSelectComponent from "@/components/Forms/AsycSelect";
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";
import Select from "@/components/Forms/Select";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import TextInput from "@/components/Forms/TextInput";

interface Option {
    id: string;
    name: string;
}

interface UserEditProps {
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

const UserEdit: React.FC<UserEditProps> = ({ isOpen, onClose, data }) => {
    interface Branch {
        id: string;
        name: string;
    }

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

    const [roles, setRoles] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

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
            branchId: branch.id
        });
    }, [branch]);

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
                <Label htmlFor="branchId">Branch</Label>
                <AsyncSelectComponent optionLabel="name" optionValue="id" value={branch} onChange={(selectedOption: Option) => setBranch(selectedOption as Branch)} loadOptions={debounce(async (inputValue: string) => {
                    const response = await fetch(`/api/branches?name=${inputValue}`);
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

export default UserEdit;
