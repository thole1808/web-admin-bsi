
"use client";
import GrafikPengunjung from "../Charts/GrafikPengunjung";
import TopBranchesTable from "../TopBranchesTable/TopBranchesTable";
import QueueStatsOverview from "../QueueStatsOverview";
import BranchVisitor from "../BranchVisitor";
import TopServiceType from "../TopServiceType";
import DailyChecklistPopup from '../DailyChecklistPopup';
import OperationalStatus from '../OperationalStatus';


const Dashboard: React.FC = () => {
  return (
    <>
      {/* <DailyChecklistPopup /> */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 space-y-6">
          <QueueStatsOverview />
          <div className='grid grid-cols-3 gap-3'>
            <div className='col-span-2'>
              <GrafikPengunjung />
            </div>
            <div>
              <TopServiceType />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <OperationalStatus />
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
