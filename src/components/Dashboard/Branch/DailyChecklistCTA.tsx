'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Sun, Moon, Eye } from 'lucide-react';

export default function DailyChecklistCTA() {
  const sodExists = true; // simulasi, ganti dengan data dari backend nanti
  const eodExists = false;

  return (
    <Card className="bg-gradient-to-tr from-teal-500 to-orange-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <CalendarCheck className="h-5 w-5" /> Checklist Harian
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start of Day */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Sun className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Start of Day (SOD)</div>
              <div className="text-xs text-gray-500">Lakukan checklist pagi sebelum layanan dimulai</div>
            </div>
            {sodExists ? (
              <Button size="sm" variant="secondary" className="text-orange-600">
                <Eye className="w-4 h-4 mr-1" /> Lihat
              </Button>
            ) : (
              <Button size="sm" variant="outline">Mulai</Button>
            )}
          </div>

          {/* End of Day */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Moon className="h-5 w-5 text-indigo-500" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">End of Day (EOD)</div>
              <div className="text-xs text-gray-500">Lakukan checklist penutupan layanan</div>
            </div>
            {eodExists ? (
              <Button size="sm" variant="secondary" className="text-indigo-600">
                <Eye className="w-4 h-4 mr-1" /> Lihat
              </Button>
            ) : (
              <Button size="sm" variant="outline">Mulai</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}