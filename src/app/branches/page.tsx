import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BranchList from "@/components/Pages/Branches/BranchList";

export const metadata: Metadata = {
    title: "QMS Console - Branches"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <BranchList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
