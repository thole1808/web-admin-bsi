import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Roles from "@/components/Roles/Roles";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title:
        "QMS Console - Template",
    description: "Web Admin BSI",
};
const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                {/* <Breadcrumb pageName="Antrian"/> */}
                <Roles />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
