import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RoleList from "@/components/Pages/Access/Roles/RoleList";

export const metadata: Metadata = {
    title: "QMS Console - Access Roles"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <RoleList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
