import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Auth from "@/components/Login/Auth";

export const metadata: Metadata = {
  title:
    "Web Admin BSI - Template",
  description: "Web Admin BSI",
};

export default function Home() {
  return (
    
    <Auth/>
  );
}
