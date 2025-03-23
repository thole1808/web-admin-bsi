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
import CreateButton from "@/components/Button/CreateButton";

interface FormData {
    label: string;
    file: File | null;
}

const BannerList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [method, setMethod] = useState<"POST" | "PUT" | "DELETE">("POST");
    const [isDelete, setIsDelete] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        label: "",
        file: null,
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/setting/banners`);
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

        if (!formOpen || !isDelete) {
            fetchData();
        }
    }, [formOpen, isDelete]);

    const openEdit = (row: any) => {
        setMethod("PUT");
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
            payload.append("label", formData.label);

            if (formData.file) {
                payload.append("file", formData.file);
            }

            const url = method === 'PUT' || method === 'DELETE' ? `/api/setting/banners/${selectedRow.id}` : "/api/setting/banners";
            let message = method === 'PUT' ? "Banner successfully updated!" : "Banner successfully created!";

            if (method === 'DELETE') {
                message = "Banner successfully deleted!";
            }
            
            const response = await fetch(url, {
                method: method,
                body: payload,
            });

            const result = await response.json();

            if (response.status === 422) {
                setErrors(result.error ? JSON.parse(result.error).data : {});
            } else if (result.success) {
                toast.success(message);
                setFormOpen(false);
                setFormData({ label: "", file: null });
                setErrors({});
                setIsDelete(false);
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

    const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            setErrors({ file: "Only PNG and JPEG images are allowed." });
            return;
        }

        if (acceptedFiles.length > 0) {
            setFormData({ ...formData, file: acceptedFiles[0] });
            setErrors({}); // Clear any previous errors
        }
    };

    const handleFormOpen = (method: "POST" | "PUT") => {
        setMethod(method);

        if (method === "POST") {
            setSelectedRow(null);
            setFormData({ label: "", file: null });
        }
        setErrors({});
        setFormOpen(true);
    };

    const openDelete = (row: any) => {
        setMethod("DELETE");
        setSelectedRow(row);
        setIsDelete(true);
    };

    const closeDelete = () => {
        setIsDelete(false);
        setSelectedRow(null);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
        multiple: false, // Hanya izinkan 1 file
    });

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-3 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2 text-gray-700">Banners</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={() => handleFormOpen('POST')} />
                    </div>
                </div>

                <DataTable
                    columns={[
                        {
                            name: "Label",
                            selector: (row: { label: string }) => row?.label || "",
                            grow: 2
                        },
                        {
                            name: "Thumbnail",
                            selector: (row: { imageUrl: string }) => row?.imageUrl || "",
                            cell: (row: { imageUrl: string }) => row.imageUrl ? (
                                <img src={`${row.imageUrl}`} className="rounded max-h-30 py-2" />
                            ) : (
                                <span>No banner available</span>
                            ),
                            grow: 2
                        },
                        {
                            name: "Link",
                            selector: (row: { imageUrl: string }) => row?.imageUrl || "",
                            cell: (row: { imageUrl: string }) => row.imageUrl ? (
                                <a href={`${row.imageUrl}`} className="text-blue-500 hover:text-blue-600 underline">{row.imageUrl}</a>
                            ) : (
                                <span>No banner available</span>
                            ),
                            grow: 2
                        },
                        {
                            name: "",
                            right: "true",
                            cell: (row: any) => (
                                <ActionGroup
                                    options={[
                                        { label: "Edit", icon: "edit", action: () => openEdit(row) },
                                        { label: 'Delete', icon: 'trash', action: () => openDelete(row) },
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
                    title={method === "POST" ? "Add Banner" : "Edit Banner"}
                    isOpen={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                >
                    <div className="mb-4 grid gap-4">
                        <TextInput
                            label="Label"
                            value={formData.label}
                            onChange={(value) => setFormData({ ...formData, label: value })}
                            error={errors.label}
                            required
                            disabled={selectedRow?.id ? true : false}
                        />

                        <div>
                            <Label htmlFor="BannerAsset" required>Banner</Label>
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

            {isDelete && (
                <ModalForm
                    title="Delete Banner"
                    isOpen={isDelete}
                    onClose={closeDelete}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                    width="sm"
                    isDestructive
                >
                    <div className="text-sm">
                        Are you sure you want to delete <strong className="underline">{selectedRow.label}</strong> from banners list?
                    </div>
                </ModalForm>
            )}
        </div>
    );
};

export default BannerList;
