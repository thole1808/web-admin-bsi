import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title:
        "QMS Console - Template",
    description: "Web Admin BSI",
};
const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
