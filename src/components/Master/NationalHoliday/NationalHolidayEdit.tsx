'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import TextInput from "@/components/Forms/TextInput";
import DateTimePicker from "@/components/Forms/DateTimePicker";

interface NationalHolidayEditProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    name: string;
    date: string;
}

const NationalHolidayEdit: React.FC<NationalHolidayEditProps> = ({ isOpen, onClose, data }) => {
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
        name: data.name,
        date: data.date,
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

            const response = await fetch(`/api/master/national-holidays/${data.id}`, {
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
                toast.success('National holiday successfully updated');
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
            title="Edit National Holiday"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <TextInput
                    label="Holiday"
                    placeholder="Enter holiday name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    error={errors?.name}
                    required
                />
            </div>
            <div className="mb-4 text-sm">
                <DateTimePicker
                    label="Date"
                    value={formData.date}
                    onChange={(value) => setFormData({ ...formData, date: value })}
                    error={errors?.date}
                    disableTime
                    required
                />
            </div>
        </ModalForm>
    );
};

export default NationalHolidayEdit;
