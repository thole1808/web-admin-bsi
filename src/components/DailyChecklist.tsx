import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import Modal from './DailyChecklistModal';  // Import the Modal component

const DailyChecklist: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sodChecklists, setSodChecklists] = useState<any[]>([]);
    const [eodChecklists, setEodChecklists] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedChecklist, setSelectedChecklist] = useState<any | null>(null);

    // TODO: mark this line as a helper function
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const localTime = new Date(today.getTime() - timezoneOffset);
    const activityDate = localTime.toISOString().split("T")[0];

    useEffect(() => {
        const fetchDailyChecklist = async () => {
            try {
                setLoading(true);

                const queryParams = new URLSearchParams({
                    activityDate,
                });

                const response = await fetch(
                    `/api/daily-checklist/show?${queryParams.toString()}`
                );

                const result = await response.json();

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

        fetchDailyChecklist();
    }, [modalOpen, activityDate]);

    const handleChecklistClick = (checklistData: any) => {
        setSelectedChecklist(checklistData);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedChecklist(null);
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
            <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-bold">
                    Checklist Harian
                </div>
                <div className="text-xs">{activityDate}</div>
            </div>
            <ul className='-mx-4 divide-y'>
                {/* SOD Checklist */}
                <li
                    className={`flex items-center justify-between text-sm py-2 px-4 cursor-pointer ${sodChecklists.length > 0 ? 'bg-green-100 hover:bg-green-200' : 'bg-white hover:bg-gray-100'
                        }`}
                    onClick={() => handleChecklistClick({ activityType: 'SOD', content: sodChecklists })}
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
                        {sodChecklists.filter((item: any) => item.checked).length} Checked
                    </div>
                </li>

                <li
                    className={`flex items-center justify-between text-sm py-2 px-4 cursor-pointer ${eodChecklists.length > 0 ? 'bg-green-100 hover:bg-green-200' : 'bg-white hover:bg-gray-100'
                        }`}
                    onClick={() => handleChecklistClick({ activityType: 'EOD', content: eodChecklists })}
                >
                    <div className='font-medium flex items-center'>
                        {eodChecklists.length > 0 ? (
                            <FaCheckCircle className='text-green-500 mr-2' />
                        ) : (
                            <FaRegTimesCircle className='text-gray-500 mr-2' />
                        )}
                        EOD
                    </div>
                    <div className='text-xs font-gray-500'>
                        {eodChecklists.filter((item: any) => item.checked).length} Checked
                    </div>
                </li>
            </ul>

            <Modal
                isOpen={modalOpen}
                data={selectedChecklist}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default DailyChecklist;
