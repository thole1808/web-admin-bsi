'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Clock, TimerReset, UserRoundCheckIcon } from 'lucide-react';

interface SummaryItem {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
}

export default function SummaryAreaMetrics() {
  const [metrics, setMetrics] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetching data dari API
    setTimeout(() => {
      const fetchedData: SummaryItem[] = [
        {
          title: 'Total Cabang',
          value: 12,
          icon: <Building2 className="w-6 h-6 text-sky-700" />,
          color: 'sky',
        },
        {
          title: 'Jumlah Cabang Aktif',
          value: 8,
          icon: <Users className="w-6 h-6 text-emerald-700" />,
          color: 'emerald',
        },
        {
          title: 'Jumlah Petugas Aktif',
          value: 14,
          icon: <Clock className="w-6 h-6 text-orange-700" />,
          color: 'orange',
        },
        {
          title: 'Jumlah Loket Aktif',
          value: 10,
          icon: <TimerReset className="w-6 h-6 text-indigo-700" />,
          color: 'indigo',
        },
      ];
      setMetrics(fetchedData);
      setLoading(false);
    }, 1000); // Delay 1 detik untuk simulasi fetch
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-100 h-[100px]" />
          ))
        : metrics.map((item, index) => (
            <Card key={index} className={`shadow-sm bg-${item.color}-100`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-semibold text-${item.color}-600 dark:text-${item.color}-300`}>
                  {item.title}
                </CardTitle>
                <div className={`p-2 rounded-md`}>
                  {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold text-${item.color}-900 dark:text-white`}>{item.value}</div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}