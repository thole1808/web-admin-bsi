'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  period: string;
}

export default function QueueTrendChart({ period }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/queue-trends?period=${period}`)
      .then(res => res.json())
      .then(res => {
        setLabels(res?.data?.labels || []);
        setData(res?.data?.data || []);
      })
      .catch(err => {
        console.error('Failed to fetch trend data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Queue Trends
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <Chart
            type="area"
            height={320}
            options={{
              chart: { toolbar: { show: false } },
              stroke: { curve: 'smooth' },
              xaxis: {
                categories: labels,
                labels: {
                  style: {
                    fontSize: '12px',
                  },
                },
              },
              yaxis: {
                title: { text: 'Total Queues' },
                min: 0,
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${val} queue${val !== 1 ? 's' : ''}`,
                },
              },
              colors: ['#3B82F6'],
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.5,
                  opacityTo: 0,
                  stops: [0, 100],
                },
              },
            }}
            series={[{
              name: 'Queues',
              data: data,
            }]}
          />
        )}
      </CardContent>
    </Card>
  );
}