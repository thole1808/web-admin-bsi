'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import TextInput from "@/components/Forms/TextInput";
import DateTimePicker from "@/components/Forms/DateTimePicker";

interface NationalHolidayCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    date: string;
}

const NationalHolidayCreate: React.FC<NationalHolidayCreateProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        date: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/national-holidays`, {
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
            title="Create National Holiday"
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

export default NationalHolidayCreate;
