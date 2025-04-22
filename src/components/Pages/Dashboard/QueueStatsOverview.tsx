import React, { useEffect, useState } from 'react';
import { FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FaArrowTrendDown, FaArrowTrendUp, FaLandMineOn } from 'react-icons/fa6';

interface Stat {
    status: 'ALL' | 'COMPLETED' | 'EXPIRE';
    current: number;
    previous: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

const QueueStatsOverview: React.FC = () => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [branchId, setbranchId] = useState<string | null>("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const userProfile = localStorage.getItem("user-profile");
          if (userProfile) {
            try {
              const parsed = JSON.parse(userProfile);
              if (parsed?.branch?.id) {
                setbranchId(parsed.branch.id.toString());
              }
            } catch (e) {
              console.error("Failed to parse user-profile", e);
            }
          }
        }
      }, []);

    useEffect(() => {
        const fetchQueueStats = async () => {
            try {

                const today = new Date();
                const timezoneOffset = today.getTimezoneOffset() * 60000;
                const localTime = new Date(today.getTime() - timezoneOffset);
                const yesterday = new Date();

                yesterday.setDate(today.getDate() - 1);

                const start = localTime.toISOString().split("T")[0] + "T00:00:00";
                const end = localTime.toISOString().split("T")[0] + "T23:59:59";
                const prevStart = `${yesterday.toISOString().split('T')[0]}T00:00:00`;
                const prevEnd = `${yesterday.toISOString().split('T')[0]}T23:59:59`;


                const queryParams = new URLSearchParams({
                    branchId: branchId?.toString() || "",
                    start,
                    end,
                    prevStart,
                    prevEnd,
                });

                const response = await fetch(`/api/dashboard/queue-stats?${queryParams.toString()}`);

                const result = await response.json();

                if (result.success) {
                    setStats(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch queue stats');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQueueStats();
    }, [branchId]);

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

    if (!stats || stats.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 rounded-xl">
            {stats
                .sort((a, b) => {
                    const priority = {
                        ALL: 1,
                        ACTIVE: 2,
                        COMPLETED: 3,
                        EXPIRE: 4,
                    };
                    return priority[a.status] - priority[b.status];
                })
                .map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 p-4"
                    >
                        <div className="flex items-center justify-center rounded-full bg-gray-100 p-3">
                            {getStatusIcon(stat.status)}
                        </div>

                        <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                                {getStatusLabel(stat.status)}
                            </h4>
                            <p className="text-2xl font-bold text-gray-800 leading-tight">
                                {stat.current}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                {getTrendIcon(stat.trend)}
                                <span className="ml-1">{getTrendLabel(stat.current, stat.previous)}</span>
                            </p>
                        </div>
                    </div>
                ))}
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

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'EXPIRE':
            return <FaThumbsDown className="text-red-500 text-xl" />;
        case 'COMPLETED':
            return <FaThumbsUp className="text-green-500 text-xl" />;
        case 'ACTIVE':
            return <FaLandMineOn className="text-orange-500 text-xl" />;
        case 'ALL':
            return <FaUser className="text-blue-500 text-xl" />;
        default:
            return null;
    }
};

const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
        case 'UP':
            return <FaArrowTrendUp className="text-green-500 mr-2" />;
        case 'DOWN':
            return <FaArrowTrendDown className="text-red-500 mr-2" />;
        case 'STABLE':
            return null;
        default:
            return null;
    }
};

const getTrendLabel = (current: number, previous: number) => {
    if (previous === 0) {
        return current > 0 ? '100% Up' : 'No change';
    }

    const percentage = ((current - previous) / previous) * 100;
    const trendText = percentage > 0 ? `Up` : `Down`;

    return `${Math.abs(percentage).toFixed(1)}% ${trendText}`;
};


export default QueueStatsOverview;
