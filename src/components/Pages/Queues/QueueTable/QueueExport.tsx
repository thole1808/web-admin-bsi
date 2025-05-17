"use client";

import React from "react";

interface ExportProps {
  data: any[];
}

export const Export: React.FC<ExportProps> = ({ data }) => {
  const convertArrayOfObjectsToCSV = (array: any[]) => {
    if (array.length === 0) return "";

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(array[0]);

    let result = keys.join(columnDelimiter) + lineDelimiter;
    array.forEach((item) => {
      result += keys.map((key) => item[key]).join(columnDelimiter);
      result += lineDelimiter;
    });

    return result;
  };

  const downloadCSV = () => {
    let csv = convertArrayOfObjectsToCSV(data);
    if (!csv) return;

    const filename = `queues-${new Date().toISOString().split("T")[0]}.csv`;
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      className="text-sm py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700"
      onClick={downloadCSV}
    >
      Download CSV
    </button>
  );
};