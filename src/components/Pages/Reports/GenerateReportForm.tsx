"use client";

import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import Select from "@/components/Forms/Select";
import DynamicReportTable from "./DynamicReportTable";

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
                console.error('Gagal memuat cabang:', err);
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
                console.error('Gagal memuat area:', err);
            }
        };
        loadAreas();
    }, [region]);

    useEffect(() => {
        const loadRegions = async () => {
            setArea('');
            setBranch('');
            try {
                const response = await fetch(`/api/branches?type=REGION&size=100`);
                const result = await response.json();
                if (result.success) {
                    setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.code, label: branch.name })));
                }
            } catch (err) {
                console.error('Gagal memuat region:', err);
            }
        };
        loadRegions();
    }, []);

    const reportTypes = [
        { value: '/api/reports/daily-queue-report', label: 'Laporan Antrian Harian' },
        { value: '/api/reports/waiting-time-report', label: 'Laporan Waktu Tunggu' },
        { value: '/api/reports/branch-load-report', label: 'Laporan Beban Cabang' },
        { value: '/api/reports/sla-report', label: 'Laporan SLA (Service Level Agreement)' },
        { value: '/api/reports/resource-allocation-report', label: 'Laporan Alokasi Sumber Daya' },
        { value: '/api/reports/service-type-popularity-report', label: 'Laporan Popularitas Layanan' },
        { value: '/api/reports/crew-cabin-check-report', label: 'Laporan Pemeriksaan Awak Kabin' },
    ];

    const fetchReport = (e: React.FormEvent) => {
        e.preventDefault();

        const { reportType, startDate, endDate } = formData;
        if (!reportType || !startDate || !endDate) return;

        setIsProcessing(true);
        setTitle(reportTypes.find((item) => item.value === reportType)?.label || "");
        setPeriod(`${formatDate(startDate)} - ${formatDate(endDate)}`);

        const queryParams = new URLSearchParams({
            start: startDate,
            end: endDate,
            regionCode: region,
            areaCode: area,
            branchCode: branch,
        });

        setApiUrl(`${reportType}?${queryParams.toString()}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('id-ID', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleReset = () => {
        setFormData({ reportType: "", startDate: "", endDate: "" });
        setApiUrl(null);
        setIsProcessing(false);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Form */}
            <div>
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Buat Laporan</h2>
                    <div className="space-y-4">
                        <Select size="xs" label="Region" options={regionOptions} value={region} onChange={(value) => setRegion(value as string)} />
                        <Select size="xs" label="Area" options={areaOptions} value={area} onChange={(value) => setArea(value as string)} disabled={!region} />
                        <Select size="xs" label="Cabang" options={branchOptions} value={branch} onChange={(value) => setBranch(value as string)} disabled={!area} />
                        <Select
                            label="Jenis Laporan"
                            options={reportTypes}
                            value={formData.reportType}
                            placeholder="Pilih jenis laporan"
                            required
                            size="xs"
                            onChange={(value) => setFormData({ ...formData, reportType: value.toString() })}
                            disabled={!!apiUrl}
                        />
                        <div className="flex justify-between gap-3">
                            <DateTimePicker
                                label="Tanggal Mulai"
                                value={formData.startDate}
                                onChange={(value) => setFormData({ ...formData, startDate: value })}
                                disableTime
                                size="xs"
                                required
                            />
                            <DateTimePicker
                                label="Tanggal Selesai"
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
                                className={`flex items-center justify-center w-full px-4 py-2 rounded-lg font-semibold text-white ${isProcessing ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'} transition-all`}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="animate-spin border-t-2 border-white rounded-full w-4 h-4 mr-2"></span>
                                        Mengambil...
                                    </>
                                ) : (
                                    <>
                                        <FaPlay className="w-4 h-4 mr-2" />
                                        Ambil Laporan
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 transition-all"
                            >
                                <FaArrowRotateLeft className="w-4 h-4 mr-2" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Result */}
            <div className="col-span-2">
                {apiUrl ? (
                    <DynamicReportTable
                        title={title}
                        apiUrl={apiUrl}
                        period={period}
                        onLoaded={() => setIsProcessing(false)}
                    />
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow-sm text-center h-full flex items-center justify-center">
                        <div>
                            <p className="text-lg font-semibold text-gray-600">Belum ada laporan!</p>
                            <p className="text-sm text-gray-400 mt-2">Silakan isi formulir lalu klik tombol buat laporan.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateReportForm;