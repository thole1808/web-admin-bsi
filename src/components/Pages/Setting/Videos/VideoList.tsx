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

const VideoList: React.FC = () => {
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
                const response = await fetch(`/api/setting/videos`);
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

            const url = method === 'PUT' || method === 'DELETE' ? `/api/setting/videos/${selectedRow.id}` : "/api/setting/videos";
            let message = method === 'PUT' ? "Video successfully updated!" : "Video successfully created!";

            if (method === 'DELETE') {
                message = "Video successfully deleted!";
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
            setErrors({ file: "Only MP4 video is allowed." });
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
            'video/mp4': [],
        },
        multiple: false, // Hanya izinkan 1 file
    });

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                <div className="p-3 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold ml-2 text-gray-700">Videos</h2>
                    <div className="flex gap-2">
                        <CreateButton onClick={() => handleFormOpen('POST')} />
                    </div>
                </div>

                <DataTable
                    columns={[
                        {
                            name: "Label",
                            selector: (row: { label: string }) => row?.label || "",
                        },
                        {
                            name: "Video",
                            selector: (row: { videoUrl: string }) => row?.videoUrl || "",
                            cell: (row: { videoUrl: string }) => row.videoUrl ? (
                                <video controls className="max-h-40 py-2">
                                    <source src={row.videoUrl} type="video/mp4" />
                                </video>
                            ) : (
                                <span>No video available</span>
                            ),
                        },
                        {
                            name: "Link",
                            selector: (row: { videoUrl: string }) => row?.videoUrl || "",
                            cell: (row: { videoUrl: string }) => row.videoUrl ? (
                                <a href={`${row.videoUrl}`} className="hover:underline text-blue-500" target="_blank">{row.videoUrl}</a>
                            ) : (
                                <span>No video available</span>
                            ),
                        },
                        {
                            name: "",
                            right: true,
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
                    title={method === "POST" ? "Add Video" : "Edit Video"}
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
                            <Label htmlFor="VideoAsset" required>Video</Label>
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
                    title="Delete Video"
                    isOpen={isDelete}
                    onClose={closeDelete}
                    onSubmit={() => handleSubmit(formData)}
                    isProcessing={isProcessing}
                    width="sm"
                    isDestructive
                >
                    <div className="text-sm">
                        Are you sure you want to delete <strong className="underline">{selectedRow.label}</strong> from videos list?
                    </div>
                </ModalForm>
            )}
        </div>
    );
};

export default VideoList;
