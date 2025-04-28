"use client";

import { MapIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { FaBuilding, FaInfo, FaMapPin } from 'react-icons/fa';

const BranchStatsOverview: React.FC = () => {
    interface Stats {
        totalBranches: number;
        totalAreas: number;
        totalRegions: number;
    }

    const [stats, setStats] = useState<Stats>({ totalBranches: 0, totalAreas: 0, totalRegions: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dashboard/branch-stats`);

                const result = await response.json();

                if (result.success) {
                    setStats(result.data);
                } else {
                    throw new Error(result.message || 'Gagal mengambil statistik cabang');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-100">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-white rounded-lg shadow-md p-4"
                    >
                        <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse mr-4"></div>
                        <div className="flex-1">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">Kesalahan: {error}</p>;
    }

    if (!stats) {
        return <p className="text-center text-gray-500">Data tidak tersedia</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg">
            {[
                {
                    title: 'Regional',
                    value: stats.totalRegions,
                    icon: <MapIcon className="h-6 w-6 text-red-500" />,
                    color: 'bg-red-100',
                },
                {
                    title: 'Area',
                    value: stats.totalAreas,
                    icon: <FaMapPin className="h-6 w-6 text-orange-500" />,
                    color: 'bg-orange-100',
                },
                {
                    title: 'Cabang',
                    value: stats.totalBranches,
                    icon: <FaBuilding className="h-6 w-6 text-green-500" />,
                    color: 'bg-green-100',
                },
                {
                    title: 'Total',
                    value: stats.totalBranches + stats.totalAreas + stats.totalRegions,
                    icon: <FaInfo className="h-6 w-6 text-blue-500" />,
                    color: 'bg-blue-100',
                },
            ].map((item, i) => (
                <div
                    key={i}
                    className="flex items-center bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                >
                    <div className={`flex items-center justify-center rounded-full ${item.color} p-3`}>
                        {item.icon}
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'EXPIRE':
            return 'Lewat Batas';
        case 'COMPLETED':
            return 'Selesai';
        case 'ALL':
            return 'Total Pengunjung';
        case 'ACTIVE':
            return 'Aktif';
        default:
            return status;
    }
};

export default BranchStatsOverview;