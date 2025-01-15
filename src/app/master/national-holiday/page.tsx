import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NationalHolidayList from "@/components/Pages/Master/NationalHoliday/NationalHolidayList";

export const metadata: Metadata = {
    title: "QMS Console - National Holidays"
};

const FormElementsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <NationalHolidayList />
            </div>
        </DefaultLayout>
    );
};

export default FormElementsPage;
