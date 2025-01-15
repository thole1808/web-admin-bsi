import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CabinCheckList from "@/components/Pages/Master/CabinChecks/CabinCheckList";

export const metadata: Metadata = {
    title: "QMS Console - Cabin Checks"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <CabinCheckList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
