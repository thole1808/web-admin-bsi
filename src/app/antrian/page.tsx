import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Antrian from "@/components/Antrian/Antrian";

export const metadata: Metadata = {
    title:
        "Web Admin BSI - Template",
    description: "Web Admin BSI",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <Antrian />
        </DefaultLayout>
    );
};

export default FormElementsPage;
