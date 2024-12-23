import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Branch from "@/components/Branches/Branch/Branch";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title:
        "Web Admin BSI - Template",
    description: "Web Admin BSI",
};
// const NoSSR = dynamic(() => import('@/components/no-ssr'), { ssr: false });
const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                {/* <Breadcrumb pageName="Antrian"/> */}
                {/* # */}
                <Branch />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
