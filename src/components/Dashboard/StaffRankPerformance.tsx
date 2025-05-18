'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeCheck, ShieldCheck, AlertTriangle, ThumbsDown } from 'lucide-react';

interface StaffPerformance {
    name: string;
    roleName: string;
    counterNum: string;
    shift: string;
    totalQueue: number;
    exceededSla: number;
    percentage: number;
    desc: string;
}

interface Props {
    period: string;
}

export default function StaffRankPerformance({ period }: Props) {
    const [staffs, setStaffs] = useState<StaffPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/analytics/staff-performances?period=' + period)
            .then((res) => res.json())
            .then((result) => setStaffs(result.data))
            .catch((err) => console.error('Failed to load staff performance data', err))
            .finally(() => setLoading(false));
    }, [period]);

    if (loading) {
        return <Skeleton className="w-full h-64 rounded-lg" />;
    }

    const getCardColorClass = (desc: string) => {
        switch (desc) {
            case 'Excellent':
                return 'bg-green-50 border-green-300';
            case 'Good':
                return 'bg-blue-50 border-blue-300';
            case 'Average':
                return 'bg-yellow-50 border-yellow-300';
            default:
                return 'bg-red-50 border-red-300';
        }
    };

    const getBadgeClass = (desc: string) => {
        switch (desc) {
            case 'Excellent':
                return 'bg-green-100 text-green-700';
            case 'Good':
                return 'bg-blue-100 text-blue-700';
            case 'Average':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-red-100 text-red-700';
        }
    };

    const getInfoBoxColorClass = (desc: string) => {
        switch (desc) {
            case 'Excellent':
                return 'bg-green-200 border-green-300';
            case 'Good':
                return 'bg-blue-200 border-blue-300';
            case 'Average':
                return 'bg-yellow-200 border-yellow-300';
            default:
                return 'bg-red-200 border-red-300';
        }
    };

    const getIcon = (desc: string) => {
        switch (desc) {
            case 'Excellent':
                return <BadgeCheck className="h-4 w-4 mr-1" />;
            case 'Good':
                return <ShieldCheck className="h-4 w-4 mr-1" />;
            case 'Average':
                return <AlertTriangle className="h-4 w-4 mr-1" />;
            default:
                return <ThumbsDown className="h-4 w-4 mr-1" />;
        }
    };

    return (
        <Card className="border border-gray-200">
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-800">Staff Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto space-y-4 p-4">
                    {staffs.map((staff, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl shadow-sm transition-all duration-200 border-t-2 ${getCardColorClass(
                                staff.desc
                            )}`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{staff.name}</div>
                                    <div className="text-xs text-gray-600">{staff.roleName} • Counter {staff.counterNum}</div>
                                </div>
                                <span
                                    className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getBadgeClass(
                                        staff.desc
                                    )}`}
                                >
                                    {getIcon(staff.desc)}
                                    {staff.desc}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className={`rounded-lg py-2 border text-sm shadow-sm ${getInfoBoxColorClass(staff.desc)}`}>
                                    <div className="text-gray-500 text-xs">Served</div>
                                    <div className="text-base font-bold text-gray-800">{staff.totalQueue}</div>
                                </div>
                                <div className={`rounded-lg py-2 border text-sm shadow-sm ${getInfoBoxColorClass(staff.desc)}`}>
                                    <div className="text-gray-500 text-xs">Exceeded SLA</div>
                                    <div className="text-base font-bold text-gray-800">{staff.exceededSla}</div>
                                </div>
                                <div className={`rounded-lg py-2 border text-sm shadow-sm ${getInfoBoxColorClass(staff.desc)}`}>
                                    <div className="text-gray-500 text-xs">SLA</div>
                                    <div className="text-base font-bold text-gray-800">{staff.percentage}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}