'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import TextInput from "@/components/Forms/TextInput";
import Select from "@/components/Forms/Select";

interface NationalHolidayEditProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;  
}

interface FormData {
    message: string;
    status: string;
}

const NationalHolidayEdit: React.FC<NationalHolidayEditProps> = ({ isOpen, onClose, data }) => {
    const [formData, setFormData] = useState<FormData>({
        message: data.message,
        status: data.status,
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/status-messages/${data.id}`, {
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
                toast.success('National holiday successfully added');
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
            title="Edit Status Message"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            <div className="mb-4 text-sm">
                <Select
                    label="Status"
                    options={[
                        { value: 'TRANSFERRED', label: 'Transferred' },
                        { value: 'CANCELED', label: 'Canceled' },
                        { value: 'STOPPED', label: 'Stopped' },
                    ]}
                    value={formData.status}
                    onChange={(value: string) => setFormData({ ...formData, status: value })}
                    placeholder="Select an option"
                    error={errors?.status}
                    required
                />
            </div>
            <div className="mb-4 text-sm">
                <TextInput
                    label="Message"
                    placeholder="Enter status message"
                    value={formData.message}
                    onChange={(value) => setFormData({ ...formData, message: value })}
                    error={errors?.message}
                    required
                />
            </div>
        </ModalForm>
    );
};

export default NationalHolidayEdit;
