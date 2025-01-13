import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServicesTypes from "@/components/Master/Layanan/DaftarLayanan";

export const metadata: Metadata = {
    title: "QMS Console - Layanan"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <ServicesTypes />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
