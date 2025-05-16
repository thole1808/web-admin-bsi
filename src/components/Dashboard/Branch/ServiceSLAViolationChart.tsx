// components/ServiceSLAViolationChart.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SLAServiceData {
  serviceType: string;
  slaViolation: number;
}

export default function ServiceSLAViolationChart() {
  const [data, setData] = useState<SLAServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/branch/service-sla-violation')
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-lg" />;
  }

  const categories = data.map(d => d.serviceType);
  const seriesData = data.map(d => d.slaViolation);

  const colors = ["#EF4444", "#F97316", "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-700">
          Jenis Layanan dengan Pelanggaran SLA Terbanyak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          type="bar"
          height={200}
          options={{
            chart: { toolbar: { show: false } },
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: true,
                borderRadius: 4,
              },
            },
            dataLabels: { enabled: true },
            xaxis: {
              categories,
              title: { text: 'Jumlah Pelanggaran SLA' },
            },
            colors: colors.slice(0, data.length),
          }}
          series={[
            {
              name: 'SLA Violation',
              data: seriesData,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
