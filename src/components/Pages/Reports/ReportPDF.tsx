import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

interface ReportPDFProps {
    title: string; // Judul laporan
    period: string; // Periode laporan
    apiUrl: string; // URL API untuk mengambil data
}

const camelCaseToTitleCase = (text: string) => {
    return text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
};

const titleCaseToCamelCase = (text: string): string => {
    return text
        .split(" ")
        .map((word, index) =>
            index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
};

const ReportPDF: React.FC<ReportPDFProps> = ({ title, period, apiUrl }) => {
    const [tableColumns, setTableColumns] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPages = async () => {
        let allData: Array<{ [key: string]: any }> = [];
        let currentPage = 0;
        let totalPages = 1;

        try {
            while (currentPage < totalPages) {
                const response = await fetch(`${apiUrl}&page=${currentPage}`);
                const result = await response.json();

                if (result.success) {
                    allData = allData.concat(result.data.details.content);
                    currentPage = result.data.details.pageable.pageNumber + 1;
                    totalPages = result.data.details.totalPages;

                    // Ambil kolom dari respons halaman pertama
                    if (currentPage === 1) {
                        const keys = Object.keys(result.data.details.content[0] || {});
                        setTableColumns(keys.map(camelCaseToTitleCase));
                    }
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            }
        } catch (err) {
            setError("Failed to fetch data from the server.");
        }

        return allData;
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const allData = await fetchAllPages();
            if (allData.length === 0) {
                setError("No data available to generate PDF.");
                setIsGenerating(false);
                return;
            }
            
            const headers = Object.keys(allData[0]).map(camelCaseToTitleCase);

            const doc = new jsPDF({
                orientation: "landscape",
                compress: true,
            });

            // Header
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(16);
            doc.text(title, pageWidth / 2, 15, { align: "center" });
            doc.setFontSize(10);
            doc.text(`Period: ${period}`, pageWidth / 2, 22, { align: "center" });

            // Content - Table
            const tableStartY = 30;
            autoTable(doc, {
                startY: tableStartY,
                head: [headers], // Dynamic column headers
                body: allData.map((row) => {
                    return headers.map((col) => row[titleCaseToCamelCase(col)] || "-")
                }),
                theme: "striped",
                headStyles: {
                    fillColor: [78, 159, 156],
                    fontSize: 10,
                },
                bodyStyles: {
                    fontSize: 10,
                },
            });

            // Footer
            const pageHeight = doc.internal.pageSize.getHeight();
            const printDate = new Date().toLocaleString();
            doc.setFontSize(8);
            doc.text(
                `Page ${doc.getNumberOfPages()} - Printed on ${printDate}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: "center" }
            );

            // Save PDF
            doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
        } catch (err) {
            console.error(err);
            setError("An error occurred while generating PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <button
            onClick={generatePDF}
            disabled={isGenerating}
            className={`${
                isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
            } text-white flex items-center px-3 py-2 text-sm rounded`}
        >
            {isGenerating ? (
                <>
                    <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                    Generating...
                </>
            ) : (
                <>
                    <FaFilePdf className="mr-2" />
                    PDF
                </>
            )}
        </button>
    );
};

export default ReportPDF;
