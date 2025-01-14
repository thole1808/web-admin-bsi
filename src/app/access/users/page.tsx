import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DaftarPengguna from "@/components/Akses/Pengguna/DaftarPengguna";

export const metadata: Metadata = {
    title: "QMS Console - Akses Pengguna"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <DaftarPengguna />
        </DefaultLayout>
    );
};

export default FormElementsPage;
