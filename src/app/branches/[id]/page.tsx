import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BranchProfile from "@/components/Branches/BranchProfile";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import BranchOfficeHoursList from "@/components/Branches/BranchOfficeHoursList";
import BranchCountersList from "@/components/Branches/BranchCountersList";

export const metadata: Metadata = {
    title: "QMS Console - Branches"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl text-gray-800 font-semibold">Manage Branch</h1>
                <Link href="/branches" className="text-sm flex gap-1 items-center bg-gray-200 py-2 px-3 hover:bg-gray-300 text-gray-500 rounded font-medium">
                    <FaChevronLeft className="h-4 w-4" />Back
                </Link>
            </div>
            <div className="flex flex-col p-6 gap-6 mt-4 bg-white rounded">
                <BranchProfile />
                <BranchOfficeHoursList />
                <BranchCountersList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
