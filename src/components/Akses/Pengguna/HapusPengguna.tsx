'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';

interface Option {
    id: string;
    name: string;
}

interface HapusPenggunaProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    id: string;
}

const HapusPengguna: React.FC<HapusPenggunaProps> = ({ isOpen, onClose, data }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/akses/pengguna/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Pengguna successfully deleted.');
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
            title="Hapus Pengguna"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit()}
            isProcessing={isProcessing}
            isDestructive
        >
            <div className="text-sm">
                Apakah Anda yakin ingin menghapus <strong className="underline">{data.name}</strong> dari daftar pengguna?
            </div>
        </ModalForm>
    );
};

export default HapusPengguna;
