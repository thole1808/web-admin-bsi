import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ApprovalMatrix from "@/components/Pages/Master/ApprovalMatrix/ApprovalMatrix";

export const metadata: Metadata = {
    title: "QMS Console - Approval Matrix",
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <ApprovalMatrix />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
