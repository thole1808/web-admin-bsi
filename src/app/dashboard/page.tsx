import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Pages/Dashboard/Dashboard";
import { getSessionUser } from "@/getSessionUser";
import BranchDashboard from "@/components/Dashboard/Branch/BranchDashboard";
import SummaryAreaMetrics from "@/components/Dashboard/Area/SummaryAreaMetrics";

export const metadata: Metadata = {
  title: "QMS Console - Dashboard",
  description: "Web Admin BSI",
};

const DashboardPage = async () => {
  const user = await getSessionUser();

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <SummaryAreaMetrics />

      {user.branch?.type === 'BRANCH' && (
        <BranchDashboard />
      )}
      </div>

    </DefaultLayout>
  );
};

export default DashboardPage;