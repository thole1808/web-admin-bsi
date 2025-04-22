
"use client";
import QueueStatsOverview from "./QueueStatsOverview";
import BranchVisitor from "./BranchVisitor";
import TopServiceType from "./TopServiceType";
import OperationalStatus from './OperationalStatus';
import DailyChecklist from "./DailyChecklist";
import TopBranchesTable from "./TopBranchesTable";
import GrafikPengunjung from "@/components/Pages/Dashboard/VisitorGraph";
import BranchStatsOverview from "./BranchStatsOverview";
import usePermission from "@/hooks/usePermission";


const Dashboard: React.FC = () => {
  const canViewBranchStats = usePermission("widget:branch-statistics");
  const canViewQueueStats = usePermission("widget:queue-statistics");
  const canViewVisitorStats = usePermission("widget:visitor-statistics");
  const canViewOperationalStatus = usePermission("widget:operational-status");
  const canViewTop3Services = usePermission("widget:top-3-services");
  const canViewTodayVisitors = usePermission("widget:today-visitors");
  const canViewDailyCabinChecks = usePermission("widget:daily-cabin-checks");
  const canViewTopVisitedBranches = usePermission("widget:top-visited-branches");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KONTEN UTAMA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ringkasan Cabang & Statistik Antrian */}
          <div className="space-y-6">
            {canViewBranchStats && (
                <BranchStatsOverview />
            )}
            {canViewQueueStats && (
              <QueueStatsOverview />
            )}
          </div>

          {/* Grafik & Top Service Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canViewVisitorStats && (
              <div className="bg-white rounded-lg shadow-sm border col-span-2">
                <GrafikPengunjung />
              </div>
            )}
            {canViewTop3Services && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="font-semibold text-gray-800 p-3 mb-3">Top 3 Services</div>
                <TopServiceType />
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {canViewOperationalStatus && (
            <OperationalStatus />
          )}

          {canViewDailyCabinChecks && (
            <DailyChecklist />
          )}

          {canViewTodayVisitors && (
            <BranchVisitor />
          )}
        </div>

        {/* TABEL CABANG */}
        {canViewTopVisitedBranches && (
        <div className="lg:col-span-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="font-semibold text-gray-800 mb-3">Top Cabang</div>
            <div className="overflow-x-auto">
              <TopBranchesTable />
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
