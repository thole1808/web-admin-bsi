import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DaftarPeran from "@/components/Akses/Peran/DaftarPeran";

export const metadata: Metadata = {
    title: "QMS Console - Akses Peran"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <DaftarPeran />
        </DefaultLayout>
    );
};

export default FormElementsPage;
