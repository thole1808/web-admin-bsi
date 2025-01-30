"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ActionGroup from "@/components/Tables/ActionGroup";
import CustomLoader from "@/components/Tables/CustomLoader";
import ModalForm from "@/components/Tables/ModalForm";
import TextInput from "@/components/Forms/TextInput";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Label from "@/components/Forms/Label";

interface FormData {
    label: string;
    file: File | null;
}

const SoundList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [formData, setFormData] = useState<FormData>({
        label: "",
        file: null,
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/setting/sounds`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                console.error(err.message);
                toast.error("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (!formOpen) {
            fetchData();
        }
    }, [formOpen]);

    const openEdit = (row: any) => {
        setSelectedRow(row);
        setFormData({
            label: row.label,
            file: null,
        });
        setFormOpen(true);
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsProcessing(true);

            const payload = new FormData();
            if (formData.file) {
                payload.append("file", formData.file);
            }

            const response = await fetch(`/api/setting/sounds/${selectedRow?.id || ''}`, {
                method: "PUT",
                body: payload,
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(result.error ? JSON.parse(result.error).data : {});
            } else if (result.success) {
                toast.success("Sound successfully updated!");
                setFormOpen(false);
                setFormData({ label: "", file: null });
                setErrors({});
            } else {
                toast.error(result.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            console.log("Error submitting form:", err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFormData({ ...formData, file: acceptedFiles[0] });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': [],  // Hanya izinkan file MP3
        },
        multiple: false, // Hanya izinkan 1 file
    });

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-2 border-b flex justify-between items-center">
                    <h2 className="text-md font-semibold ml-2 text-gray-700">Caller Sounds</h2>
                </div>

                <DataTable
                    columns={[
                        {
                            name: "Label",
                            selector: (row: { label: string }) => row?.label || "",
                        },
                        {
                            name: "Link",
                            selector: (row: { soundUrl: string }) => row?.soundUrl || "",
                            cell: (row: { soundUrl: string }) => row.soundUrl ? (
                                <a href={`${row.soundUrl}`} className="hover:underline text-blue-500" target="_blank">{row.soundUrl}</a>
                            ) : (
                                <span>No audio available</span>
                            ),
                        },
                        {
                            name: "",
                            right: true,
                            cell: (row: any) => (
                                <ActionGroup
                                    options={[
                                        { label: "Edit", icon: "edit", action: () => openEdit(row) },
                                    ]}
                                />
                            ),
                        },
                    ]}
                    data={data}
                    progressPending={loading}
                    progressComponent={<CustomLoader />}
                    pagination
                />
            </div>

            {formOpen && (
                <ModalForm
                    width="lg"
                    title="Edit Sounds"
                    isOpen={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                >
                    <div className="mb-4 text-sm grid gap-4">
                        <TextInput
                            label="Label"
                            value={formData.label}
                            onChange={(value) => setFormData({ ...formData, label: value })}
                            error={errors.label}
                            required
                            disabled
                        />

                        <div>
                            <Label htmlFor="soundAsset" required>Sound Asset</Label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed p-4 text-center cursor-pointer ${isDragActive ? "bg-gray-100" : ""}`}
                            >
                                <input {...getInputProps()} />
                                {formData.file ? (
                                    <p>{formData.file.name}</p>
                                ) : (
                                    <p>Drag and drop a file here, or click to select one</p>
                                )}
                            </div>
                            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                        </div>
                    </div>
                </ModalForm>
            )}
        </div>
    );
};

export default SoundList;
