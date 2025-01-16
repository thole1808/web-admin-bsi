"use client";

import React, { useState } from "react";
import { FaDownload, FaPlay } from "react-icons/fa";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import Select from "@/components/Forms/Select";
import DynamicReportTable from "./DynamicReportTable";

const GenerateReportForm: React.FC = () => {
    const [formData, setFormData] = useState({
        reportType: "",
        startDate: "",
        endDate: "",
        format: "pdf",
    });

    const [apiUrl, setApiUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const reportTypes = [
        { value: 'daily-queue-report', label: 'Daily Queue Report' },
        { value: 'waiting-time-report', label: 'Waiting Time Report' },
        { value: 'branch-load-report', label: 'Branch Load Report' },
        { value: 'sla-report', label: 'Service Level Agreement Report' },
        { value: 'monthly-trend-report', label: 'Monthly and Trend Analysis Report' },
        { value: 'resource-allocation-report', label: 'Resource Allocation Report' },
        { value: 'service-type-popularity-report', label: 'Service Type Popularity Report' },
        { value: 'cabin-crew-check-report', label: 'Cabin Crew Check Report' },
    ];

    const fetchReport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const type = formData.reportType;
        const start = formData.startDate;
        const end = formData.endDate;
        const format = formData.format;

        setTitle(reportTypes.find((item) => item.value === type)?.label || "");

        const queryParams = new URLSearchParams({
            start,
            end,
            format,
        });

        setApiUrl(`/api/reports/${type}?${queryParams.toString()}`);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div>
                <div className="p-6 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Report</h2>
                    <div className="space-y-4">
                        <Select
                            label="Report Type"
                            options={reportTypes}
                            value={formData.reportType}
                            placeholder="Select report type"
                            required
                            size="xs"
                            onChange={(value) => setFormData({ ...formData, reportType: value.toString() })}
                        />
                        <div className="flex justify-between gap-3">
                            <DateTimePicker
                                label="Start Date"
                                value={formData.startDate}
                                onChange={(value) => setFormData({ ...formData, startDate: value })}
                                disableTime
                                size="xs"
                                required
                            />
                            <DateTimePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={(value) => setFormData({ ...formData, endDate: value })}
                                disableTime
                                size="xs"
                                required
                            />
                        </div>

                        <button
                            onClick={fetchReport}
                            disabled={isProcessing}
                            className={`${isProcessing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-teal-500 hover:bg-teal-600"
                                } text-white rounded flex items-center px-4 py-2 text-sm font-medium w-full justify-center`}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FaPlay className="w-3 h-3 mr-2" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                {apiUrl ? (
                    <DynamicReportTable
                        title={title}
                        apiUrl={apiUrl}
                        onLoaded={() => setIsProcessing(false)}
                    />
                ) : (
                    <div className="p-6 bg-white rounded-lg text-center h-full flex items-center justify-center">
                        <div>
                            <p className="text-gray-600 text-lg">No report generated yet!</p>
                            <p className="text-gray-400 mt-1">
                                Please fill up the form and click generate.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateReportForm;
