'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import ToggleInput from "@/components/Forms/Toogle";
import TextInput from "@/components/Forms/TextInput";
import Select from "@/components/Forms/Select";

interface Option {
    id: string;
    name: string;
}

interface CabinCheckEditProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    activityName: string;
    activityType: string;
    mandatory: boolean;
    active: boolean;
}

const CabinCheckEdit: React.FC<CabinCheckEditProps> = ({ isOpen, onClose, data }) => {
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
        activityName: data.activityName,
        activityType: data.activityType,
        mandatory: data.mandatory,
        active: data.active,
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        setFormData({
            ...formData,
        });
    }, [permissionData]);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/cabin-checks/${data.id}`, {
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
                toast.success('Cabin Check berhasil ditambahkan');
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
            title="Create Cabin Check"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <TextInput
                    label="Activity"
                    placeholder="Enter your activity name"
                    value={formData.activityName}
                    onChange={(value) => setFormData({ ...formData, activityName: value })}
                    error={errors?.activityName}
                />
            </div>
            <div className="mb-4 text-sm">
                <Select
                    label="Type"
                    options={[
                        { value: 'SOD', label: 'SOD (Start of Day)' },
                        { value: 'EOD', label: 'EOD (End of Day)' },
                      ]}
                    value={formData.activityType}
                    onChange={(value: string) => setFormData({ ...formData, activityType: value })}
                    placeholder="Select an option"
                    error={errors?.activityType}
                />
            </div>
            <div className="mb-4 text-sm">
                <ToggleInput
                    label="Manadatory"
                    initialValue={false}
                    onChange={(value) => setFormData({ ...formData, mandatory: value })}
                />
                {errors?.mandatory && <p className="text-red-500 text-xs mt-1">{errors?.mandatory}</p>}
            </div>
            <div className="mb-4 text-sm">
                <ToggleInput
                    label="Active"
                    initialValue={true}
                    onChange={(value) => setFormData({ ...formData, active: value })}
                />
                {errors?.active && <p className="text-red-500 text-xs mt-1">{errors?.active}</p>}
            </div>

        </ModalForm>
    );
};

export default CabinCheckEdit;
