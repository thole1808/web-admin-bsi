import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalProps {
    isOpen: boolean;
    data: any;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, data, onClose }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ [key: string]: boolean }>({});
    const [activities, setActivities] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const initializeFormData = (checklists: any[]) => {
            const newFormData: { [key: string]: boolean } = {};
            if (data.content && Array.isArray(data.content)) {
                data.content.forEach((contentItem: any) => {
                    checklists.forEach((checklist: any) => {
                        if (checklist.activityName === contentItem.activityName && contentItem.checked === true) {
                            newFormData[checklist.id] = true;
                        }
                    });
                });
            }
    
            setFormData(newFormData);
        };

        const fetchChecklists = async () => {
            try {
                setLoading(true);
    
                const response = await fetch(
                    `/api/master/cabin-checks`
                );
    
                const result = await response.json();
    
                if (result.success) {
                    const sortedActivities = result.data
                        .filter((item: any) => item.activityType === data.activityType)
                        .sort((a: any, b: any) => a.activityNum - b.activityNum);
    
                    setActivities(sortedActivities);
                    initializeFormData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch master of checklists");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChecklists();
    }, [data, isOpen]);

    const handleCheckboxChange = (id: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: !prevData[id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const activityType = data.activityType;
        const checklists = Object.keys(formData)
            .filter((key) => formData[key] === true)
            .map((key) => parseInt(key));


        if (checklists.length === 0) {
            console.error("No checklists selected!");
            return;
        }

        const method = data.content.length > 0 ? 'PUT' : 'POST';
        const requestData = {
            checklists,
            method
        };

        try {
            const response = await fetch(`/api/daily-checklist?activityType=${activityType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Cabin crew check successfully saved');
            } else {
                console.error('Failed to submit data:', result);
            }

            onClose();
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={onClose}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg z-60"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700">
                            X
                        </button>
                        <h2 className="text-lg font-semibold mb-1">{data.activityType} Checklist</h2>
                        <p className="mb-4 text-sm">Harap lakukan checklist terhadap aktifitas yang sudah dilakukan!</p>

                        {loading ? (
                            <SkeletonLoader /> // Show skeleton loader when loading
                        ) : (
                            <form className='text-sm' onSubmit={handleSubmit}>
                                {activities.map((checklist: any) => (
                                    <div key={checklist.id} className="flex items-start justify-between gap-3 mb-2">
                                        <label htmlFor={checklist.id} className="block font-medium text-gray-700">
                                            {checklist.activityName}
                                        </label>
                                        <input
                                            type="checkbox"
                                            id={checklist.id}
                                            name={checklist.id}
                                            checked={formData[checklist.id] || false} // Check the state for the current checkbox
                                            onChange={() => handleCheckboxChange(checklist.id)} // Toggle the checkbox state on change
                                            className="w-4 h-4 text-blue-500 border border-gray-300 rounded-md min-w-15"
                                        />
                                    </div>
                                ))}
                                <button className='mt-4 p-3 text-md font-bold text-center w-full bg-green-500 hover:bg-green-400 text-white rounded' type="submit">Simpan {data.activityType}</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
