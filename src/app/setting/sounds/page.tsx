import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SoundList from "@/components/Pages/Setting/Sounds/SoundList";

export const metadata: Metadata = {
    title: "QMS Console - Sounds"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <SoundList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
