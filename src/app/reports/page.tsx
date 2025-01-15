import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GenerateReportForm from "@/components/Pages/Reports/GenerateReportForm";

export const metadata: Metadata = {
    title: "QMS Console - Reports",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <GenerateReportForm />
        </DefaultLayout>
    );
};

export default FormElementsPage;
