'use client';

import { XMarkIcon } from "@heroicons/react/24/solid";
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

const ModalForm: React.FC<ModalFormProps> = ({
  width,
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  isProcessing,
  isDestructive,
}) => {
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

  const getMaxWidthClass = (width: string = 'xl') => {
    const sizeMap: { [key: string]: string } = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '4xl': 'max-w-4xl',
      '6xl': 'max-w-6xl',
    };
    return sizeMap[width] || 'max-w-xl';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg ${getMaxWidthClass(width)} w-full z-50 relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-b px-6 py-5 flex justify-between items-center">
          <h2 className="text-lg font-bold">{title}</h2>
          <div className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer" onClick={onClose}>
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {children}

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
                <span>Processing...</span>
              ) : isDestructive ? (
                <>
                  Delete <FaTrash className="ml-2" />
                </>
              ) : (
                <>
                  Save <FaSave className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;