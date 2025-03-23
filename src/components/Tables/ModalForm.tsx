'use client';

import React from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import { BeatLoader } from 'react-spinners';

interface ModalFormProps {
    width?: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { [key: string]: string }) => void;
    children: React.ReactNode;
    isProcessing?: boolean;
    isDestructive?: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({ width, title, isOpen, onClose, onSubmit, children, isProcessing, isDestructive }) => {
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

        onSubmit(formData);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-lg max-w-${width || 'sm'} w-full z-50`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    {children}
                    {/* Add a loader overlay */}
                    {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                            <BeatLoader size={15} color="#4fa94d" />
                        </div>
                    )}
                    <div className="first-line:gap-2 mt-6 flex justify-between relative">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded-md flex items-center font-medium ${
                                isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
                            }`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <span>Proccessing...</span>
                            ) : (
                                isDestructive ? (
                                    <>
                                        Delete <FaTrash className="ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Save <FaSave className="ml-2" />
                                    </>
                                )
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalForm;
