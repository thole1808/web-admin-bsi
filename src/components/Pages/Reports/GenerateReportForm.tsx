"use client";

import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import DateTimePicker from "@/components/Forms/DateTimePicker"; // Pastikan Anda memiliki komponen ini
import Select from "@/components/Forms/Select"; // Pastikan Anda memiliki komponen ini
import { toast } from "react-toastify";

const GenerateReportForm: React.FC = () => {
    const [formData, setFormData] = useState({
        reportType: "",
        startDate: "",
        endDate: "",
        format: "pdf",
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors(null);

        if (!formData.startDate || !formData.endDate) {
            setErrors({ message: "Both start and end dates are required." });
            return;
        }

        try {
            setIsProcessing(true);

            //   await onSubmit(formData);

            toast.success("Report generated successfully!");
        } catch (error: any) {
            console.error("Error generating report:", error);
            toast.error("Failed to generate report. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    label="Report Type"
                    options={[
                        { value: 'DQR', label: 'Daily Queue Report' },
                        { value: 'BPR', label: 'Branch Performance Report' },
                        { value: 'WTR', label: 'Waiting Time Report' },
                        { value: 'BLR', label: 'Branch Load Report' },
                        { value: 'SLA', label: 'Service Level Agreement Report' },
                        { value: 'MTR', label: 'Monthly and Trend Analysis Report' },
                        { value: 'RAR', label: 'Resource Allocation Report' },
                        { value: 'STP', label: 'Service Type Popularity Report' },
                    ]}
                    value={formData.reportType}
                    placeholder="Select report type"
                    required
                    onChange={(value) => setFormData({ ...formData, reportType: value.toString() })}
                    error={errors?.reportType}
                />


                <div className="flex justify-between gap-3">
                    <DateTimePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(value) => setFormData({ ...formData, startDate: value })}
                        disableTime
                        required
                        error={errors?.startDate}
                    />
                    <DateTimePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(value) => setFormData({ ...formData, endDate: value })}
                        disableTime
                        required
                        error={errors?.endDate}
                    />
                </div>

                <Select
                    label="Format"
                    options={[
                        { value: "pdf", label: "PDF" },
                        { value: "excel", label: "Excel" },
                    ]}
                    value={formData.format}
                    onChange={(value) => setFormData({ ...formData, format: value.toString() })}
                    placeholder="Select report format"
                />

                <div className="border-t pt-4">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`${isProcessing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-teal-500 hover:bg-teal-600"
                                } text-white rounded flex items-center px-4 py-3 text-sm font-medium`}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FaDownload className="w-4 h-4 mr-2" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
            {errors?.message && <p className="text-red-500 text-sm mt-2">{errors.message}</p>}
        </div>
    );
};

export default GenerateReportForm;
