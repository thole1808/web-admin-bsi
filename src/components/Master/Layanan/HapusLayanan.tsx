'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';

interface Option {
    id: string;
    name: string;
}

interface HapusLayananProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface FormData {
    id: string;
}

const HapusLayanan: React.FC<HapusLayananProps> = ({ isOpen, onClose, data }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/layanan/${data.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Layanan berhasil dihapus');
                onClose();
            } else {
                toast.error(result.message || "Terjadi kendala sistem. Harap ulangi beberapa saat lagi.");
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally { 
            setIsProcessing(false);
        }
    };

    return (
        <ModalForm
            title="Hapus Layanan"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit()}
            isProcessing={isProcessing}
            isDestructive
        >
            <div className="text-sm">
                Apakah Anda yakin ingin menghapus <strong className="underline">{data.name}</strong> dari daftar layanan?
            </div>
        </ModalForm>
    );
};

export default HapusLayanan;
