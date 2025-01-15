import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserList from "@/components/Pages/Access/Users/UserList";

export const metadata: Metadata = {
    title: "QMS Console - Access Users"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <UserList />
        </DefaultLayout>
    );
};

export default FormElementsPage;
