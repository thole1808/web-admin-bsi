import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Pages/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "QMS Console - Dashboard",
  description: "Web Admin BSI",
};

const DashboardPage = () => {
  return (
    <DefaultLayout>
        <Dashboard />
    </DefaultLayout>
  );
};

export default DashboardPage;