import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Antrian from "@/components/Antrian/Antrian";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title:
        "Web Admin BSI - Template",
    description: "Web Admin BSI",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Antrian"/>
            <div className="flex flex-col gap-10">
                <Antrian />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
