import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import QueueTable from "@/components/Queues/QueueTable";

export const metadata: Metadata = {
    title: "QMS Console - Queues"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <QueueTable />
        </DefaultLayout>
    );
};

export default FormElementsPage;
