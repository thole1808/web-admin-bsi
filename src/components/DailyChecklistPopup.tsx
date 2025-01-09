import React, { useState, useEffect } from 'react';

// Popup Component
const DailyChecklistPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true); // state to control popup visibility
    const [data, setData] = useState<any[]>([]);
    const [sodChecklists, setSodChecklists] = useState<any[]>([]);
    const [eodChecklists, setEodChecklists] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sodFormData, setSodFormData] = useState<{ [key: string]: boolean }>({});
    const activityDate = new Date().toISOString().split("T")[0];

    const handleCheckboxChange = (id: string) => {
        setSodFormData((prevData) => ({
            ...prevData,
            [id]: !prevData[id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', sodFormData);

        const activityDate = new Date().toISOString().split('T')[0];
        const activityType = 'SOD';
        const checklists = Object.keys(sodFormData)
            .filter((key) => sodFormData[key] === true)
            .map((key) => parseInt(key));

       
        if (checklists.length === 0) {
            console.error("No checklists selected!");
            return;
        }

        const branchId = 1;

        const requestData = {
            activityDate,
            activityType,
            checklists,
            branchId,
        };

        try {
            const response = await fetch(`/api/daily-checklist/sod`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (result.success) {
                console.log('Data successfully submitted:', result);
            } else {
                console.error('Failed to submit data:', result);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        } finally {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, []);

    useEffect(() => {
        fetchDailyChecklist();
    }, []);

    const fetchChecklists = async () => {
        try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                activityDate,
            });

            const response = await fetch(
                `/api/master/checklist`
            );

            const result = await response.json();

            console.log(result);

            if (result.success) {
                setSodChecklists(result.data.filter((item: any) => item.activityType === 'SOD'));
                setEodChecklists(result.data.filter((item: any) => item.activityType === 'EOD'));
            } else {
                throw new Error(result.message || "Failed to fetch master of checklists");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

            if (result.success) {
                setData(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch branch visitors");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openPopup = () => {
        setIsOpen(true); // set the state to open the popup
    };

    const closePopup = () => {
        setIsOpen(false); // set the state to close the popup
    };

    // Skeleton loader component
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
                    onClick={closePopup}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg z-60"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700">
                            X
                        </button>
                        <h2 className="text-lg font-semibold mb-1">SOD Checklist</h2>
                        <p className="mb-4 text-sm">Harap lakukan checklist terhadap aktifitas yang sudah dilakukan!</p>

                        {loading ? (
                            <SkeletonLoader /> // Show skeleton loader when loading
                        ) : (
                            <form className='text-sm' onSubmit={handleSubmit}>
                                {sodChecklists.map((checklist) => (
                                    <div key={checklist.id} className="flex items-center justify-between mb-2">
                                        <label htmlFor={checklist.id} className="block text-sm font-medium text-gray-700">
                                            {checklist.activityName}
                                        </label>
                                        <input
                                            type="checkbox"
                                            id={checklist.id}
                                            name={checklist.id}
                                            checked={sodFormData[checklist.id] || false} // Check the state for the current checkbox
                                            onChange={() => handleCheckboxChange(checklist.id)} // Toggle the checkbox state on change
                                            className="w-4 h-4 text-blue-500 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                                <button className='mt-4 p-3 text-md font-bold text-center w-full bg-green-500 hover:bg-green-400 text-white rounded' type="submit">Simpan SOD</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyChecklistPopup;
