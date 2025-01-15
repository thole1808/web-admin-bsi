'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';

interface Option {
    id: string;
    name: string;
}

interface UserDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    id: string;
}

const UserDelete: React.FC<UserDeleteProps> = ({ isOpen, onClose, data }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/access/users/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.success('User successfully deleted.');
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
            title="Delete User"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit()}
            isProcessing={isProcessing}
            isDestructive
        >
            <div className="text-sm">
                Are you sure you want to delete <strong className="underline">{data.name}</strong> from users list?
            </div>
        </ModalForm>
    );
};

export default UserDelete;
