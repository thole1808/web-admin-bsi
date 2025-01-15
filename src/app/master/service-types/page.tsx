import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServicesTypeList from "@/components/Pages/Master/ServiceTypes/ServiceTypeList";

export const metadata: Metadata = {
    title: "QMS Console - Layanan"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <ServicesTypeList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
