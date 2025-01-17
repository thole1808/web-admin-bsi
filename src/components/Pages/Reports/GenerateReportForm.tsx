"use client";

import React, { useState } from "react";
import { FaDownload, FaPlay } from "react-icons/fa";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import Select from "@/components/Forms/Select";
import DynamicReportTable from "./DynamicReportTable";
import { FaArrowRotateLeft } from "react-icons/fa6";

const GenerateReportForm: React.FC = () => {
    const [formData, setFormData] = useState({
        reportType: "",
        startDate: "",
        endDate: "",
        format: "pdf",
    });

    const [apiUrl, setApiUrl] = useState<string | null>(null);
    const [period, setPeriod] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const reportTypes = [
        { value: '/api/reports/daily-queue-report', label: 'Daily Queue Report' },
        { value: '/api/reports/waiting-time-report', label: 'Waiting Time Report' },
        { value: '/api/reports/branch-load-report', label: 'Branch Load Report' },
        { value: '/api/reports/sla-report', label: 'Service Level Agreement Report' },
        { value: '/api/reports/monthly-trend-report', label: 'Monthly and Trend Analysis Report' },
        { value: '/api/reports/resource-allocation-report', label: 'Resource Allocation Report' },
        { value: '/api/reports/service-type-popularity-report', label: 'Service Type Popularity Report' },
        { value: '/api/reports/cabin-crew-check-report', label: 'Cabin Crew Check Report' },
    ];

    const fetchReport = (e: React.FormEvent) => {
        e.preventDefault();

        const type = formData.reportType;
        const start = formData.startDate;
        const end = formData.endDate;
        const format = formData.format;

        setIsProcessing(true);
        setTitle(reportTypes.find((item) => item.value === type)?.label || "");
        setPeriod(`${formatDate(start)} - ${formatDate(end)}`);

        const queryParams = new URLSearchParams({
            start,
            end,
            format,
        });

        setApiUrl(`${type}?${queryParams.toString()}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('id-ID', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleReset = () => {
        setFormData({
            reportType: "",
            startDate: "",
            endDate: "",
            format: "pdf",
        });
        setApiUrl(null);
        setIsProcessing(false);
    }

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

                        {!apiUrl ? (
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
                        ) : (
                            <button
                                onClick={handleReset}
                                disabled={isProcessing}
                                className="bg-gray-400 text-white rounded flex items-center px-4 py-2 text-sm font-medium w-full justify-center"
                            >
                                <FaArrowRotateLeft className="w-3 h-3 mr-2" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                {apiUrl ? (
                    <DynamicReportTable
                        title={title}
                        apiUrl={apiUrl}
                        period={period}
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
