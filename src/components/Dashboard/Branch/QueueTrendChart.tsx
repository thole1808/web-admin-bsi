'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TrendPoint {
  label: string;
  total: number;
}

export default function QueueTrendChart() {
  const [data, setData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('2024-05-01');
  const [end, setEnd] = useState('2024-05-07');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/branch/queue-trend?start=${start}&end=${end}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, [start, end]);

  const categories = data.map(d => d.label);
  const values = data.map(d => d.total);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Tren Jumlah Antrean
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
                categories,
              },
              yaxis: {
                title: { text: 'Total Antrean' },
                min: 0,
              },
              tooltip: {
                y: {
                  formatter: (val: number) => `${val} antrean`,
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
              name: 'Antrean',
              data: values,
            }]}
          />
        )}
      </CardContent>
    </Card>
  );
}