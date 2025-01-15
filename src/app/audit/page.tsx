import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuditList from "@/components/Pages/Audit/AuditList";

export const metadata: Metadata = {
    title: "QMS Console - Queues"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <AuditList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
