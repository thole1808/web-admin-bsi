import { Metadata } from "next"; // import dari 'next' untuk server-side metadata
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Web Admin BSI - Template",
  description: "Web Admin BSI",
};

const DashboardPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <Dashboard />
      </div>
    </DefaultLayout>
  );
};

export default DashboardPage;