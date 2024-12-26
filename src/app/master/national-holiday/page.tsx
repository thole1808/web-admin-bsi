import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NationalHoliday from "@/components/Master/NationalHoliday/NationalHoliday";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title:
        "Web Admin BSI - Template",
    description: "Web Admin BSI",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                {/* <Breadcrumb pageName="NationalHoliday"/> */}
                {/* # */}
                <NationalHoliday />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
