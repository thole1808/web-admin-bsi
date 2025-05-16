'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SLAHistory {
    date: string;
    sla: number;
}

interface StaffSLAData {
    name: string;
    history: SLAHistory[];
}

interface Staff {
    name: string;
    role: string;
    counter: string;
    shift: string;
    totalServed: number;
    slaPerformance: number;
}

export default function TodayStaffList() {
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [data, setData] = useState<StaffSLAData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dummy data
        const dummyData: StaffSLAData[] = [
            {
                name: 'Ahmad Rizki',
                history: [
                    { date: '2024-05-01', sla: 91 },
                    { date: '2024-05-02', sla: 87 },
                    { date: '2024-05-03', sla: 93 },
                    { date: '2024-05-04', sla: 79 },
                    { date: '2024-05-05', sla: 84 },
                ],
            },
            {
                name: 'Dewi Lestari',
                history: [
                    { date: '2024-05-01', sla: 88 },
                    { date: '2024-05-02', sla: 90 },
                    { date: '2024-05-03', sla: 92 },
                    { date: '2024-05-04', sla: 80 },
                    { date: '2024-05-05', sla: 86 },
                ],
            },
            {
                name: 'Budi Santoso',
                history: [
                    { date: '2024-05-01', sla: 72 },
                    { date: '2024-05-02', sla: 78 },
                    { date: '2024-05-03', sla: 75 },
                    { date: '2024-05-04', sla: 81 },
                    { date: '2024-05-05', sla: 79 },
                ],
            },
        ];

        setTimeout(() => {
            setData(dummyData);
            setLoading(false);
        }, 500);

        fetch('/api/analytics/branch/today-staff')
            .then(res => res.json())
            .then(res => {
                setStaffs(res.data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Skeleton className="w-full h-64 rounded-lg" />;
    }

    const categories = data[0]?.history.map(h => h.date) || [];
    const series = data.map(staff => ({
        name: staff.name,
        data: staff.history.map(h => h.sla),
    }));

    if (loading) {
        return (
            <Card className="border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-gray-700">Petugas Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-md" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border border-gray-200">
                <CardHeader className="flex pb-4">
                    <div className="text-sm font-semibold text-gray-700 justify-between flex items-center gap-2">
                        <span>Performa Kinerja Petugas</span>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-10">
                    <div className='bg-gray-50 px-3 rounded-lg'>
                        {staffs.map((staff, index) => (
                            <div
                                key={index}
                                className="py-3 grid grid-cols-12 items-center gap-2 border-b last:border-none"
                            >
                                {/* Nama & Role */}
                                <div className="col-span-4 space-y-0.5">
                                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {staff.role} • Loket {staff.counter}
                                    </div>
                                </div>

                                {/* Total Terlayani */}
                                <div className="col-span-2 text-center text-xs text-gray-600">
                                    <div className="mb-0.5 font-normal">Terlayani</div>
                                    <div className="font-semibold text-gray-900">{staff.totalServed}</div>
                                </div>

                                {/* Melebihi SLA */}
                                <div className="col-span-2 text-center text-xs text-gray-600">
                                    <div className="mb-0.5 font-normal">Melebihi SLA</div>
                                    <div className="font-semibold text-gray-900">{staff.totalServed % 2}</div>
                                </div>

                                {/* SLA Performance */}
                                <div className="col-span-2 text-center text-xs text-gray-600">
                                    <div className="mb-0.5 font-normal">SLA</div>
                                    <div
                                        className={`text-sm font-semibold ${staff.slaPerformance >= 90
                                            ? "text-green-600"
                                            : staff.slaPerformance >= 75
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {staff.slaPerformance}%
                                    </div>
                                </div>

                                {/* Status Label (opsional) */}
                                <div className="col-span-2 text-right">
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${staff.slaPerformance >= 90
                                            ? "bg-green-100 text-green-700"
                                            : staff.slaPerformance >= 75
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {staff.slaPerformance >= 90
                                            ? "Sangat Baik"
                                            : staff.slaPerformance >= 75
                                                ? "Cukup"
                                                : "Buruk"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className='text-sm font-semibold text-gray-700'>Riwayat SLA Harian Petugas</h4>
                        <Chart
                            type="line"
                            height={300}
                            options={{
                                chart: {
                                    id: 'staff-sla-chart',
                                    toolbar: { show: false },
                                    zoom: { enabled: false },
                                },
                                xaxis: {
                                    categories,
                                    labels: { rotate: -45 },
                                },
                                yaxis: {
                                    max: 100,
                                    min: 0,
                                    title: { text: 'SLA (%)' },
                                },
                                colors: ['#3B82F6', '#F59E0B', '#EF4444'],
                                stroke: {
                                    curve: 'smooth',
                                    width: 2,
                                },
                                markers: {
                                    size: 4,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                                tooltip: {
                                    y: {
                                        formatter: (val: number) => `${val}%`,
                                    },
                                },
                            }}
                            series={series}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}