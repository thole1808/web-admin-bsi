'use client';

import React, { useState, useEffect } from "react";
import ModalForm from "@/components/Tables/ModalForm";
import { toast } from 'react-toastify';
import Label from "@/components/Forms/Label";
import Select from 'react-select';

interface ServiceTypeAddChildProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    layanan: any;
}

interface FormData {
    code: string;
    rsvCode: string;
    productCode: string;
    name: string;
    prefix: string;
    slaMinDuration: string;
    slaMaxDuration: string;
    parentId: any;
}

const ServiceTypeAddChild: React.FC<ServiceTypeAddChildProps> = ({ isOpen, onClose, data, layanan }) => {
    const [formData, setFormData] = useState<FormData>({
        code: data.code,
        rsvCode: data.rsvCode,
        productCode: data.productCode,
        name: "",
        prefix: data.prefix,
        slaMinDuration: data.slaMinDuration,
        slaMaxDuration: data.slaMaxDuration,
        parentId: layanan?.find((item: any) => item.id === data.id) ? { value: data.id, label: layanan?.find((item: any) => item.id === data.id).name } : null,
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const inputStyles = 'block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6';

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/master/layanan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    parentId: formData.parentId?.value || '0'
                }),
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(JSON.parse(result.error).data);
            } else if (result.success) {
                toast.success('Layanan berhasil diperbarui');
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
            title="Create Sub Layanan"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => handleSubmit(formData)}
            isProcessing={isProcessing}
        >
            {formData.parentId !== 0 && (
                <div className="mb-4 text-sm">
                    <Label htmlFor="parent" required>Parent</Label>
                    <Select options={layanan?.map((item: any) => ({ value: item.id, label: item.name }))} value={formData.parentId} isDisabled />
                    {errors?.parentId && <p className="text-red-500 text-xs mt-1">{errors?.parentId}</p>}
                </div>
            )}
            <div className="mb-4 text-sm">
                <Label htmlFor="code">Kode Layanan</Label>
                <input
                    type="text"
                    id="code"
                    placeholder="Kode Layanan"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className={inputStyles}
                    required
                />
                {errors?.code && <p className="text-red-500 text-xs mt-1">{errors?.code}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="rsvCode">Kode Reservasi</Label>
                <input
                    type="text"
                    id="rsvCode"
                    placeholder="Kode Reservasi"
                    value={formData.rsvCode}
                    onChange={(e) => setFormData({ ...formData, rsvCode: e.target.value })}
                    className={inputStyles}
                    required
                />
                {errors?.rsvCode && <p className="text-red-500 text-xs mt-1">{errors?.rsvCode}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="prefix">Prefix</Label>
                <input
                    type="text"
                    id="prefix"
                    placeholder="Prefix"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    className={inputStyles + ` bg-gray-100`}
                    disabled
                />
                {errors?.prefix && <p className="text-red-500 text-xs mt-1">{errors?.prefix}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="name" required>Layanan</Label>
                <input
                    type="text"
                    id="name"
                    placeholder="Nama Layanan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyles}
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name}</p>}
            </div>
            <div className="mb-4 text-sm">
                <Label htmlFor="slaMinDuration" required>Durasi SLA</Label>
                <div className="grid grid-cols-2 gap-2 justify-between">
                    <div>
                        <input
                            type="number"
                            id="slaMinDuration"
                            placeholder="Durasi Min"
                            value={formData.slaMinDuration}
                            onChange={(e) => setFormData({ ...formData, slaMinDuration: e.target.value })}
                            className={inputStyles}
                        />
                        {errors?.slaMinDuration && <p className="text-red-500 text-xs mt-1">{errors?.slaMinDuration}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            id="slaMaxDuration"
                            placeholder="Durasi Max"
                            value={formData.slaMaxDuration}
                            onChange={(e) => setFormData({ ...formData, slaMaxDuration: e.target.value })}
                            className={inputStyles}
                        />
                        {errors?.slaMaxDuration && <p className="text-red-500 text-xs mt-1">{errors?.slaMaxDuration}</p>}
                    </div>
                </div>
            </div>

        </ModalForm>
    );
};

export default ServiceTypeAddChild;
