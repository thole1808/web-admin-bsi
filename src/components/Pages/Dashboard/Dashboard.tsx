
"use client";
import QueueStatsOverview from "./QueueStatsOverview";
import BranchVisitor from "./BranchVisitor";
import TopServiceType from "./TopServiceType";
import OperationalStatus from './OperationalStatus';
import DailyChecklist from "./DailyChecklist";
import TopBranchesTable from "./TopBranchesTable";
import GrafikPengunjung from "@/components/Pages/Dashboard/VisitorGraph";


const Dashboard: React.FC = () => {
  return (
    <>
      {/* <DailyChecklistPopup /> */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 space-y-6">
          <QueueStatsOverview />
          <div className='grid grid-cols-3 gap-3 bg-white rounded-lg'>
            <div className='col-span-2 border-r'>
              <GrafikPengunjung />
            </div>
            <div>
              <TopServiceType />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <OperationalStatus />
          <DailyChecklist />
          <BranchVisitor />
        </div>
        <div className="col-span-1 md:col-span-4 space-y-6">
          <div className="col-span-1 md:col-span-3">
            <div className="overflow-x-auto">
              <TopBranchesTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
