"use client";

import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import Select from "@/components/Forms/Select";
import DynamicReportTable from "./DynamicReportTable";
import { FaArrowRotateLeft } from "react-icons/fa6";

const GenerateReportForm: React.FC = () => {
    const [formData, setFormData] = useState({
        reportType: "",
        startDate: "",
        endDate: "",
    });

    const [apiUrl, setApiUrl] = useState<string | null>(null);
    const [period, setPeriod] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [branch, setBranch] = useState("");
    const [area, setArea] = useState("");
    const [region, setRegion] = useState("");
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [regionOptions, setRegionOptions] = useState<any[]>([]);
    
    useEffect(() => {
        const loadBranches = async () => {
            try {
                const response = await fetch(`/api/branches?type=BRANCH&areaCode=${area}&size=500`);
                const result = await response.json();

                if (result.success) {
                    setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching branches:', err);
            }
        };

        loadBranches();
    }, [area]);

    useEffect(() => {
        const loadAreas = async () => {
            setBranch('');
            
            try {
                const response = await fetch(`/api/branches?type=AREA&regionCode=${region}`);
                const result = await response.json();

                if (result.success) {
                    setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        loadAreas();
    }, [region]);

    useEffect(() => {
        const loadRegions = async () => {
            setBranch('');
            setArea('');

            try {
                const response = await fetch(`/api/branches?type=REGION&size=100`);
                const result = await response.json();

                if (result.success) {
                    setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching regions:', err);
            }
        };

        loadRegions();
    }, []);

    const reportTypes = [
        { value: '/api/reports/daily-queue-report', label: 'Daily Queue Report' },
        { value: '/api/reports/waiting-time-report', label: 'Waiting Time Report' },
        { value: '/api/reports/branch-load-report', label: 'Branch Load Report' },
        { value: '/api/reports/sla-report', label: 'Service Level Agreement Report' },
        { value: '/api/reports/resource-allocation-report', label: 'Resource Allocation Report' },
        { value: '/api/reports/service-type-popularity-report', label: 'Service Type Popularity Report' },
        { value: '/api/reports/crew-cabin-check-report', label: 'Cabin Crew Check Report' },
    ];

    const fetchReport = (e: React.FormEvent) => {
        e.preventDefault();

        const type = formData.reportType;
        const start = formData.startDate;
        const end = formData.endDate;
        const regionCode = region;
        const areaCode = area;
        const branchCode = branch;

        if (!type || !start || !end) {
            return;
        }

        setIsProcessing(true);
        setTitle(reportTypes.find((item) => item.value === type)?.label || "");
        setPeriod(`${formatDate(start)} - ${formatDate(end)}`);

        const queryParams = new URLSearchParams({
            start,
            end,
            regionCode,
            areaCode,
            branchCode,
        });

        setApiUrl(`${type}?${queryParams.toString()}`);

        console.log(`${type}?${queryParams.toString()}`);
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
            ...formData,
            reportType: ""
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
                        <Select size="xs" label="Region" options={regionOptions} value={region} onChange={(value) => setRegion(value as string)} />
                        <Select size="xs" label="Area" options={areaOptions} value={area} onChange={(value) => setArea(value as string)} disabled={region === ''} />
                        <Select size="xs" label="Branch" options={branchOptions} value={branch} onChange={(value) => setBranch(value as string)} disabled={area === ''} />
                        <Select
                            label="Report Type"
                            options={reportTypes}
                            value={formData.reportType}
                            placeholder="Select report type"
                            required
                            size="xs"
                            onChange={(value) => setFormData({ ...formData, reportType: value.toString() })}
                            disabled={apiUrl ? true : false}
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
                                    } text-white rounded flex items-center px-4 py-2 font-medium w-full justify-center`}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                                        Fetching...
                                    </>
                                ) : (
                                    <>
                                        <FaPlay className="w-3 h-3 mr-2" />
                                        Fetch Report
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleReset}
                                disabled={isProcessing}
                                className="bg-gray-400 text-white rounded flex items-center px-4 py-2 font-medium w-full justify-center"
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
