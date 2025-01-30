import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BannerList from "@/components/Pages/Setting/Banners/BannerList";

export const metadata: Metadata = {
    title: "QMS Console - Signage"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <BannerList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
