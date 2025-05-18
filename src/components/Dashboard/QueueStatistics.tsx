'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, PhoneCall, Clock, CheckCircle, XCircleIcon, TimerReset } from "lucide-react";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface QueueStatistics {
    waiting: number;
    skipped: number;
    called: number;
    canceled: number;
    started: number;
    paused: number;
    continued: number;
    forwarded: number;
    stopped: number;
    avgWaitingDuration: number;
    avgServiceDuration: number;
    maxWaitingDuration: number;
    maxServiceDuration: number;
    slaViolation: number;
    pending: number;
    inProgress: number;
    served: number;
    unserved: number;
    total: number;
    lastUpdatedAt: string;
}

interface Props {
    period: string;
}

export default function QueueStatistics({ period }: Props) {
    const [data, setData] = useState<QueueStatistics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/analytics/queue-statistics?period=' + period)
            .then((res) => res.json())
            .then((result) => {
                setData({
                    ...result.data,
                    lastUpdatedAt: new Date().toISOString(),
                });
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!data) return <p className="text-red-500">Gagal memuat data.</p>;

    const remaining = data.total - data.served - data.canceled;

    return (
        <div className="space-y-6">
            {/* Statistik */}
            <div className='space-y-6'>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-sky-50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-sm text-sky-800">Total Queues</CardTitle>
                                <Users className="h-5 w-5 text-sky-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-sky-900">{data.total}</p>
                            <div className='text-sm mt-1'>
                                {data.slaViolation} queues exceeded SLA
                            </div>
                            <div className='mt-4'>
                                <Chart
                                    type="donut"
                                    width="100%"
                                    height={340}
                                    options={{
                                        labels: ["Completed", "Missed", "In Progress", "Waiting"],
                                        colors: ["#34D399", "#FB7185", "#60A5FA", "#FBBF24"],
                                        legend: {
                                            position: "right",
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            style: {
                                                fontSize: "12px",
                                                colors: ["#fff"]
                                            },
                                            formatter: (val: number) => `${val.toFixed(1)}%`,
                                            background: {
                                                enabled: true,
                                                foreColor: '#fff',
                                                padding: 4,
                                                borderRadius: 2,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                opacity: 0.9,
                                                dropShadow: {
                                                    enabled: false,
                                                    top: 1,
                                                    left: 1,
                                                    blur: 1,
                                                    color: '#000',
                                                    opacity: 0.45
                                                }
                                            },
                                            dropShadow: {
                                                enabled: false,
                                                top: 1,
                                                left: 1,
                                                blur: 1,
                                                color: '#000',
                                                opacity: 0.45
                                            }
                                        },
                                        stroke: {
                                            width: 2,
                                            colors: ["#fff"],
                                        },
                                        tooltip: {
                                            enabled: false,
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: "60%",
                                                    labels: {
                                                        show: true,
                                                        value: {
                                                            show: true,
                                                            fontSize: "16px",
                                                            offsetY: -5,
                                                            color: "#ffffff",
                                                        },
                                                        total: {
                                                            show: true,
                                                            label: "Total",
                                                            fontSize: "14px",
                                                            color: "#6B7280",
                                                            formatter: () => `${data.total}`,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                    series={[data.served, data.unserved, data.inProgress, data.pending]}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className='grid grid-cols-2 gap-4'>
                        <Card className="bg-green-50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="text-sm text-green-800">Completed</CardTitle>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold text-green-900">{data.served}</p>
                                <div className='text-sm mt-1'>
                                    +{data.canceled} queues canceled
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="text-sm text-red-800">Missed</CardTitle>
                                    <XCircleIcon className="h-5 w-5 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold text-red-900">{data.unserved}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-orange-50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="text-sm text-orange-800">Waiting</CardTitle>
                                    <TimerReset className="h-5 w-5 text-orange-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold text-orange-900">{data.pending}</p>
                                <div className='text-sm mt-1'>
                                    +{data.skipped} queues skipped
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="text-sm text-blue-800">In Progress</CardTitle>
                                    <PhoneCall className="h-5 w-5 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold text-blue-900">{data.inProgress}</p>
                                <div className='text-sm mt-1'>
                                    +{data.paused} queues paused
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-1">
                            <div className="flex items-center justify-between w-full">
                                <CardTitle className="text-sm font-semibold text-gray-700">Queue Duration Summary</CardTitle>
                                <Clock className="h-5 w-5 text-gray-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div className="text-center bg-sky-50 border border-sky-100 p-4 rounded-xl">
                                    <div className="text-sky-700 font-medium mb-1">Avg. Waiting Time</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {Math.round(data.avgWaitingDuration / 60)} menit
                                    </div>
                                </div>

                                <div className="text-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <div className="text-emerald-700 font-medium mb-1">Avg. Service Time</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {Math.round(data.avgServiceDuration / 60)} menit
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 text-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                    <div className="text-indigo-700 font-medium mb-1">Avg. Total Time</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {Math.round((data.avgWaitingDuration + data.avgServiceDuration) / 60)} menit
                                    </div>
                                </div>

                                <div className="text-center bg-orange-50 border border-orange-100 p-4 rounded-xl">
                                    <div className="text-orange-700 font-medium mb-1">Max Waiting Time</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {Math.round(data.maxWaitingDuration / 60)} menit
                                    </div>
                                </div>

                                <div className="text-center bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                    <div className="text-rose-700 font-medium mb-1">Max Service Time</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {Math.round(data.maxServiceDuration / 60)} menit
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-3">
                                Duration is calculated from served queues in {period.replace('_', ' ')}.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}