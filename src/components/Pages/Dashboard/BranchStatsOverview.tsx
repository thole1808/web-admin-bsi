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
                    throw new Error(result.message || 'Failed to fetch branch stats');
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
                        {/* Skeleton untuk ikon */}
                        <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse mr-4"></div>

                        {/* Skeleton untuk konten */}
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
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!stats) {
        return <p className="text-center text-gray-500">No data available</p>;
    }
    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!stats) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-100">
            <div
                className="flex items-center bg-white rounded-lg shadow-md p-4"
            >
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-4">
                    <MapIcon className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-600 text-xs font-semibold">
                        Regions
                    </h4>
                    <p className="text-gray-800 text-xl font-bold">{stats.totalRegions}</p>
                </div>
            </div>
            <div
                className="flex items-center bg-white rounded-lg shadow-md p-4"
            >
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-4">
                    <FaMapPin className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-600 text-xs font-semibold">
                        Areas
                    </h4>
                    <p className="text-gray-800 text-xl font-bold">{stats.totalAreas}</p>
                </div>
            </div>
            <div
                className="flex items-center bg-white rounded-lg shadow-md p-4"
            >
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-4">
                    <FaBuilding className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-600 text-xs font-semibold">
                        Branches
                    </h4>
                    <p className="text-gray-800 text-xl font-bold">{stats.totalBranches}</p>
                </div>
            </div>
            <div
                className="flex items-center bg-white rounded-lg shadow-md p-4"
            >
                <div className="flex-shrink-0 bg-gray-100 rounded-full p-4">
                    <FaInfo className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-600 text-xs font-semibold">
                        Total
                    </h4>
                    <p className="text-gray-800 text-xl font-bold">{stats.totalBranches + stats.totalAreas + stats.totalRegions}</p>
                </div>
            </div>
        </div>
    );
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'EXPIRE':
            return 'Missed';
        case 'COMPLETED':
            return 'Completed';
        case 'ALL':
            return 'Total Visitors';
        case 'ACTIVE':
            return 'Active';
        default:
            return status;
    }
};

export default BranchStatsOverview;
