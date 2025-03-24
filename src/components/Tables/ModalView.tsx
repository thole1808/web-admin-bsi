'use client';

import React from "react";

interface ModalViewProps {
    width?: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalView: React.FC<ModalViewProps> = ({ width, title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData: { [key: string]: string } = {};
        const formElements = (e.target as HTMLFormElement).elements as any;

        for (let element of formElements) {
            if (element.name) {
                formData[element.name] = element.value;
            }
        }
    };

    const getMaxWidthClass = (width: string = 'sm') => {
        const sizeMap: { [key: string]: string } = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
        };
        return sizeMap[width] || 'max-w-sm';
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-lg ${getMaxWidthClass(width)} w-full z-50 relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                {children}
                <div className="relative mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md w-full font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalView;
