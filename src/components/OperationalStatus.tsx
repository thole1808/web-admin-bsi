import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaSun, FaTimesCircle } from 'react-icons/fa';

interface Data {
    dateTime: string;
    status: string;
    message: string;
    timeOpen?: string;
    timeClosed?: string;
}

const OperationalStatus: React.FC = () => {
    const [data, setData] = useState<Data>({ dateTime: '', status: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getStatusCardColor = (status: string) => {
        switch (status) {
            case 'NATIONAL_HOLIDAY':
                return 'bg-yellow-500 text-white';
            case 'OPEN':
                return 'bg-green-500 text-white';
            case 'CLOSED':
                return 'bg-red-500 text-white';
            case 'HOLIDAY':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'NATIONAL_HOLIDAY':
                return <FaSun size={60} />;
            case 'OPEN':
                return <FaCheckCircle size={60} />;
            case 'CLOSED':
                return <FaTimesCircle size={60} />;
            case 'HOLIDAY':
                return <FaCalendarCheck size={60} />;
            default:
                return <FaTimesCircle size={60} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'NATIONAL_HOLIDAY':
                return 'Libur Nasional';
            case 'OPEN':
                return 'Buka';
            case 'CLOSED':
                return 'Tutup';
            case 'HOLIDAY':
                return 'Libur';
            default:
                return 'Tutup';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/operational-status`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch operational status');
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
            <div className={`flex items-center mb-4 rounded-lg shadow-md p-4 overflow-hidden`}>
                <div className='-ml-6 -mt-8'>
                    <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse mr-4"></div>
                </div>

                <div className="flex-1">
                    <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>

                    <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse mb-2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex gap-2 items-start ${getStatusCardColor(data.status)} mb-4 rounded-lg shadow-md p-4 overflow-hidden`}>
            <div className="flex-1">
                <div className="text-xl font-bold">{getStatusText(data.status) || 'Tutup'}</div>
                <div className="text-sm">{data.status === 'OPEN' ? `Pukul ${data.timeOpen} hingga ${data.timeClosed}` : '-'}</div>
            </div>
            <div className='-mr-6 -mt-6'>
                {getStatusIcon(data.status)}
            </div>
        </div>
    );
};

export default OperationalStatus;
