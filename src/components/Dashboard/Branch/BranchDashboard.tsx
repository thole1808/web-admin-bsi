'use client';

import DailyChecklistCTA from "./DailyChecklistCTA";
import QueueSummary from "./QueueSummary";
import QueueTrendChart from "./QueueTrendChart";
import ServiceSLAViolationChart from "./ServiceSLAViolationChart";
import ServiceTypeQueueChart from "./ServiceTypeQueueChart";
import TodayStaffList from "./TodayStaffList";

export default function BranchDashboard() {
  return (
    <div className="space-y-6">
      <DailyChecklistCTA />

      <QueueSummary />

      <QueueTrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodayStaffList />
        <div className="grid gap-4">
          <ServiceTypeQueueChart />
          <ServiceSLAViolationChart />
        </div>
      </div>
    </div>
  );
}