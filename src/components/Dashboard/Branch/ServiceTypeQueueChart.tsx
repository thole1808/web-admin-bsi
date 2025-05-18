'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface QueueByServiceType {
    serviceType: string;
    total: number;
}

interface Props {
    period: string;
}

export default function ServiceTypeQueueChart({ period }: Props) {
    const [data, setData] = useState<QueueByServiceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics/branch/service-type-queues?period='+period)
            .then(res => res.json())
            .then(res => {
                setData(res.data);
                setLoading(false);
            });
    }, [period]);

    if (loading) {
        return <Skeleton className="w-full h-64 rounded-lg" />;
    }

    const categories = data.map(d => d.serviceType);
    const seriesData = data.map(d => d.total);

    const colorPalette = [
        "#3B82F6", // blue
        "#10B981", // green
        "#F59E0B", // amber
        "#EF4444", // red
        "#8B5CF6", // purple
        "#14B8A6", // teal
        "#EC4899", // pink
        "#6366F1", // indigo
        "#F97316", // orange
        "#22D3EE", // cyan
        "#84CC16", // lime
        "#A855F7", // violet
        "#F43F5E", // rose
        "#EAB308", // yellow
        "#0EA5E9", // sky
        "#4ADE80", // emerald
        "#F87171", // soft red
        "#2DD4BF", // turquoise
        "#C084FC", // soft purple
        "#FB923C", // soft orange
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">
                    Queue by Service Type
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Chart
                    type="bar"
                    height={250}
                    options={{
                        chart: { toolbar: { show: false } },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 3,
                                distributed: true,
                            },
                        },
                        xaxis: {
                            categories,
                            labels: {
                                show: false
                            }
                        },
                        colors: colorPalette.slice(0, data.length),
                    }}
                    series={[{
                        name: 'Antrean',
                        data: seriesData,
                    }]}
                />
            </CardContent>
        </Card>
    );
}
