'use client';

import React, { useState } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';

interface NationalHolidayDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const NationalHolidayDelete: React.FC<NationalHolidayDeleteProps> = ({ isOpen, onClose, data }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/status-messages/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Status message successfully deleted.');
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
            title="Delete Status Message"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit()}
            isProcessing={isProcessing}
            isDestructive
        >
            <div className="text-sm">
                Are you sure you want to remove <strong className="underline">{data.message}</strong> from the status messages list?
            </div>
        </ModalForm>
    );
};

export default NationalHolidayDelete;
