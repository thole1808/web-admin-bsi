import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaFileExcel } from "react-icons/fa";

interface ReportExcelProps {
    title: string;
    apiUrl: string;
}

const camelCaseToTitleCase = (text: string) => {
    return text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
};

const ReportExcel: React.FC<ReportExcelProps> = ({ title, apiUrl }) => {
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPages = async (): Promise<Array<{ [key: string]: any }>> => {
        let allData: Array<{ [key: string]: any }> = [];
        let currentPage = 0;
        let totalPages = 1;

        try {
            while (currentPage < totalPages) {
                const response = await fetch(`${apiUrl}?page=${currentPage}`);
                const result = await response.json();

                if (result.success) {
                    allData = allData.concat(result.data.content);
                    currentPage = result.data.pageable.pageNumber + 1;
                    totalPages = result.data.totalPages;
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching data");
        }

        return allData;
    };

    const exportToExcel = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const data = await fetchAllPages();

            if (data.length === 0) {
                setError("No data available to export.");
                setIsExporting(false);
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Report");

            // Tambahkan Header
            const headers = Object.keys(data[0]);
            worksheet.addRow(headers.map(camelCaseToTitleCase));

            // Tambahkan Data
            data.forEach((row: any) => {
                worksheet.addRow(Object.values(row));
            });

            // Gaya Header
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: "center" };
            });

            // Simpan File
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, `${title.replace(/\s+/g, "_")}.xlsx`);
        } catch (err: any) {
            setError(err.message || "An error occurred while generating Excel.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button
                onClick={exportToExcel}
                disabled={isExporting}
                className={`${isExporting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                    } text-white flex items-center px-3 py-2 text-xs rounded`}
            >
                {isExporting ? (
                    <>
                        <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                        Exporting...
                    </>
                ) : (
                    <>
                        <FaFileExcel className="mr-2" />
                        Excel
                    </>
                )}
            </button>
        </div>
    );
};

export default ReportExcel;
