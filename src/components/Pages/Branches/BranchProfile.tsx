"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";

interface BranchData {
    id: number;
    type: string;
    code: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    longitude: number | null;
    latitude: number | null;
    timezone: string;
    maxRoomCapacity: number;
    maxQueueCapacity: number;
    useCustomServiceType: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

const SkeletonLoader: React.FC = () => {
    return (
        <div className="bg-white animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-2 w-3/5"></div>
                </div>
            </div>
        </div>
    );
};


const BranchProfile: React.FC = () => {
    const [branchData, setBranchData] = useState<BranchData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchBranchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/branches/${id}`);
                const result = await response.json();

                if (result.success) {
                    setBranchData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch branch data");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchBranchData();
    }, [id]);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (!branchData) {
        return <p className="text-gray-500">No branch data available.</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">
                {branchData.name} <small className="text-teal-500 text-sm">#{branchData.code || '-'}</small>
            </h2>
            <div className="text-gray-600 flex items-center">{branchData.address}</div>
            {branchData.phone && (
                <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2" />
                    {branchData.phone}
                </div>
            )}
            <div className="grid grid-cols-2 justify-start items-start max-w-4xl">
                <div className="grid gap-y-2 mt-4">
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {branchData.type || '-'}</p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Room Capacity</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {branchData.maxRoomCapacity || '-'}</p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Queue Capacity</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {branchData.maxQueueCapacity || '-'}</p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Timezone</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {branchData.timezone || '-'}</p>
                    </div>
                </div>
                <div className="grid gap-y-2 mt-4">
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp;&nbsp;
                            <span className={`font-medium ${branchData.active ? "text-green-500" : "text-red-500"}`}>{branchData.active ? "Active" : "Inactive"}</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Created At</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {new Date(branchData.createdAt).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="grid grid-cols-3">
                        <p className="text-gray-500">Updated At</p>
                        <p className="font-medium text-gray-800 col-span-2">:&nbsp; {new Date(branchData.updatedAt).toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BranchProfile;
