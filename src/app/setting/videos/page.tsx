import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VideoList from "@/components/Pages/Setting/Videos/VideoList";

export const metadata: Metadata = {
    title: "QMS Console - Signage"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <VideoList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
