'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SLAHistory {
  date: string;
  percentage: number;
}

interface StaffHistory {
  name: string;
  history: SLAHistory[];
}

interface Props {
  period: string;
}

export default function StaffSLAHistories({ period }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/staff-sla-histories?period=' + period)
      .then(res => res.json())
      .then(res => {
        const data: StaffHistory[] = res.data;

        // Ambil semua tanggal unik sebagai label
        const allDates = new Set<string>();
        data.forEach(staff => {
          staff.history.forEach(entry => {
            allDates.add(entry.date);
          });
        });

        const sortedLabels = Array.from(allDates).sort();
        setLabels(sortedLabels);

        // Bangun series data per staff
        const chartSeries = data.map(staff => ({
          name: staff.name,
          data: sortedLabels.map(date => {
            const entry = staff.history.find(h => h.date === date);
            return entry ? entry.percentage : 0;
          }),
        }));

        setSeries(chartSeries);
        setLoading(false);
      });
  }, [period]);

  if (loading) return <Skeleton className="w-full h-64 rounded-lg" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-700">
          SLA Trend per Staff
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          type="line"
          height={300}
          series={series}
          options={{
            chart: {
              id: 'staff-sla-trend',
              toolbar: { show: false }
            },
            xaxis: {
              categories: labels,
              title: { text: 'Date' },
            },
            yaxis: {
              title: { text: 'SLA (%)' },
              min: 0,
              max: 100,
            },
            colors: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#8B5CF6'],
            stroke: { curve: 'smooth', width: 2 },
            markers: { size: 4 },
            tooltip: {
              y: {
                formatter: (val: number) => `${val}%`,
              },
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}