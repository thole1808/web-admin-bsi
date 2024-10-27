import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Antrian from "@/components/Antrian/Antrian";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Cabang from "@/components/Cabang/Cabang";

export const metadata: Metadata = {
    title:
        "Web Admin BSI - Template",
    description: "Web Admin BSI",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <Breadcrumb pageName="Cabang"/>
                <Cabang />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
