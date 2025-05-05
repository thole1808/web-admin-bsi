"use client";

import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import Select from "@/components/Forms/Select";
import DynamicReportTable from "./DynamicReportTable";
import { useSession } from "next-auth/react";

const GenerateReportForm: React.FC = () => {
    const { data: session } = useSession();
    const branchType = (session?.user as any)?.branch?.type ?? 'HO';

    console.log(session);

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
                const response = await fetch(`/api/branches?type=REGION`);
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
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Laporan</h2>
                    <div className="space-y-4">
                        {['HO'].includes(branchType) && (
                            <Select label="Region" options={regionOptions} value={region} onChange={(value) => setRegion(value as string)} />
                        )}

                        {['HO', 'REGION'].includes(branchType) && (
                            <Select label="Area" options={areaOptions} value={area} onChange={(value) => setArea(value as string)} />
                        )}

                        {['HO', 'REGION', 'AREA'].includes(branchType) && (
                            <Select label="Cabang" options={branchOptions} value={branch} onChange={(value) => setBranch(value as string)} />
                        )}

                        <Select
                            label="Jenis Laporan"
                            options={reportTypes}
                            value={formData.reportType}
                            placeholder="Pilih jenis laporan"
                            required
                            onChange={(value) => setFormData({ ...formData, reportType: value.toString() })}
                            disabled={!!apiUrl}
                        />
                        <div className="flex justify-between gap-3">
                            <DateTimePicker
                                label="Tanggal Mulai"
                                value={formData.startDate}
                                onChange={(value) => setFormData({ ...formData, startDate: value })}
                                disableTime
                                size="sm"
                                required
                            />
                            <DateTimePicker
                                label="Tanggal Selesai"
                                value={formData.endDate}
                                onChange={(value) => setFormData({ ...formData, endDate: value })}
                                disableTime
                                size="sm"
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
                                        Mohon tunggu...
                                    </>
                                ) : (
                                    <>
                                        <FaPlay className="w-3 h-3 mr-2" />
                                        Proses Laporan
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