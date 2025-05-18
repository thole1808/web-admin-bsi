'use client';

import { useState } from "react";
import DailyChecklistCTA from "./DailyChecklistCTA";
import QueueStatistics from "../QueueStatistics";
import QueueTrendChart from "./QueueTrendChart";
import ServiceSLAViolationChart from "./ServiceSLAViolationChart";
import ServiceTypeQueueChart from "./ServiceTypeQueueChart";
import DashboardFilter from "../DashboardFilter";
import StaffRankPerformance from "../StaffRankPerformance";
import StaffSLAHistories from "../StaffSLAHistories";
import { useSession } from "next-auth/react";

export default function BranchDashboard() {
  const [period, setPeriod] = useState<string>("today");
  const {data: session} = useSession();

  return (
    <div className="space-y-6">
      {session?.user.branch?.type === 'BRANCH' && (
        <DailyChecklistCTA />
      )}

      {/* 👉 Kirim props ke DashboardFilter */}
      <DashboardFilter period={period} setPeriod={setPeriod} />

      {/* 👉 Kirim props ke komponen yang membutuhkan */}
      <QueueStatistics period={period} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StaffRankPerformance period={period} />
        <StaffSLAHistories period={period} />
        <ServiceTypeQueueChart period={period} />
        <ServiceSLAViolationChart period={period} />
      </div>

      <QueueTrendChart period={period} />
    </div>
  );
}