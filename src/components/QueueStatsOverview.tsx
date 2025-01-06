import React, { useEffect, useState } from 'react';
import { FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';

interface Stat {
    status: 'ALL' | 'COMPLETED' | 'MISSED';
    current: number;
    previous: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
}

const QueueStatsOverview: React.FC = () => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!stats || stats.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-100">
            {stats
                .sort((a, b) => {
                    const priority = {
                        ALL: 1,
                        COMPLETED: 2,
                        MISSED: 3,
                    };  

                    return priority[a.status] - priority[b.status];
                })
                .map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-white rounded-lg shadow-md p-4"
                    >
                        <div className="flex-shrink-0 bg-gray-100 rounded-full p-4">
                            {getStatusIcon(stat.status)}
                        </div>
                        <div className="ml-4">
                            <h4 className="text-gray-600 text-sm font-semibold">
                                {getStatusLabel(stat.status)}
                            </h4>
                            <p className="text-gray-800 text-xl font-bold">{stat.current}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                {getTrendIcon(stat.trend)} {getTrendLabel(stat.current, stat.previous)}
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'MISSED':
            return 'Tidak Terlayani';
        case 'COMPLETED':
            return 'Terlayani';
        case 'ALL':
            return 'Total Pengunjung';
        default:
            return status;
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'MISSED':
            return <FaThumbsDown className="text-red-400 text-2xl" />;
        case 'COMPLETED':
            return <FaThumbsUp className="text-green-400 text-2xl" />;
        case 'ALL':
            return <FaUser className="text-blue-400 text-2xl" />;
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
        return current > 0 ? '100% Up from yesterday' : 'No change';
    }

    const percentage = ((current - previous) / previous) * 100;
    const trendText = percentage > 0 ? `Up` : `Down`;

    return `${Math.abs(percentage).toFixed(1)}% ${trendText} from yesterday`;
};


export default QueueStatsOverview;
