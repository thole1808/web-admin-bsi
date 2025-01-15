import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import StatusMessageList from "@/components/Pages/Master/StatusMessages/StatusMessageList";

export const metadata: Metadata = {
    title: "QMS Console - Status Messages",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <StatusMessageList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
