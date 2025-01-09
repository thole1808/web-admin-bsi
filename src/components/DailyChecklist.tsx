import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

// Popup Component
const DailyChecklist: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sodChecklists, setSodChecklists] = useState<any[]>([]);
    const [eodChecklists, setEodChecklists] = useState<any[]>([]);

    useEffect(() => {
        fetchDailyChecklist();
    }, []);

    const fetchDailyChecklist = async () => {
        try {
            setLoading(true);

            const activityDate = new Date().toISOString().split("T")[0];

            const queryParams = new URLSearchParams({
                activityDate,
            });

            const response = await fetch(
                `/api/daily-checklist/show?${queryParams.toString()}`
            );

            const result = await response.json();

            console.log(result);

            if (result.success) {
                setSodChecklists(result.data.content.filter((item: any) => item.activityType === 'SOD'));
                setEodChecklists(result.data.content.filter((item: any) => item.activityType === 'EOD'));
            } else {
                throw new Error(result.message || "Failed to fetch branch visitors");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Skeleton for loading state with dynamic background based on the status
    const getSkeletonColor = (status: string) => {
        switch (status) {
            case 'NATIONAL_HOLIDAY':
                return 'bg-yellow-200'; // Light yellow skeleton
            case 'OPEN':
                return 'bg-green-200'; // Light green skeleton
            case 'CLOSED':
                return 'bg-red-200'; // Light red skeleton
            case 'HOLIDAY':
                return 'bg-blue-200'; // Light blue skeleton
            default:
                return 'bg-gray-200'; // Default gray skeleton
        }
    };

    if (loading) {
        return (
            <div className={`bg-white mb-4 rounded-lg shadow-md p-4 overflow-hidden`}>
                <div className="text-sm font-bold mb-2">Checklist Harian</div>
                <ul className='-mx-4 divide-y'>
                    {/* Skeleton for SOD */}
                    <li className="flex items-center justify-between text-sm py-2 px-4 cursor-pointer">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-2"></div>
                            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </li>

                    {/* Skeleton for EOD */}
                    <li className="flex items-center justify-between text-sm py-2 px-4 cursor-pointer">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-2"></div>
                            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <div className={`bg-white mb-4 rounded-lg shadow-md p-4 overflow-hidden`}>
            <div className="text-sm font-bold mb-2">Checklist Harian</div>
            <ul className='-mx-4 divide-y'>
                {/* SOD Checklist */}
                <li
                    className={`flex items-center justify-between text-sm py-2 px-4 cursor-pointer ${
                        sodChecklists.length > 0 ? 'bg-green-100' : 'bg-white'
                    } hover:bg-gray-100`}
                >
                    <div className='font-medium flex items-center'>
                        {sodChecklists.length > 0 ? (
                            <FaCheckCircle className='text-green-500 mr-2' />
                        ) : (
                            <FaRegTimesCircle className='text-gray-500 mr-2' />
                        )}
                        SOD
                    </div>
                    <div className='text-xs font-gray-500'>
                        {sodChecklists.length} Checked
                    </div>
                </li>

                {/* EOD Checklist */}
                <li
                    className={`flex items-center justify-between text-sm py-2 px-4 cursor-pointer ${
                        eodChecklists.length > 0 ? 'bg-blue-100' : 'bg-white'
                    } hover:bg-gray-100`}
                >
                    <div className='font-medium flex items-center'>
                        {eodChecklists.length > 0 ? (
                            <FaCheckCircle className='text-blue-500 mr-2' />
                        ) : (
                            <FaRegTimesCircle className='text-gray-500 mr-2' />
                        )}
                        EOD
                    </div>
                    <div className='text-xs font-gray-500'>
                        {eodChecklists.length} Checked
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default DailyChecklist;
