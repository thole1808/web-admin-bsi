import React from 'react';

interface ExportCSVProps {
  data: any[];
  filename?: string;
}

const ExportCSV: React.FC<ExportCSVProps> = ({ data, filename = 'export.csv' }) => {
  const convertArrayOfObjectsToCSV = (array: any[]): string => {
    if (!array || array.length === 0) return '';

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);

    let result = keys.join(columnDelimiter) + lineDelimiter;

    array.forEach((item) => {
      let row = '';
      keys.forEach((key, index) => {
        if (index > 0) row += columnDelimiter;
        row += `"${item[key]}"`;
      });
      result += row + lineDelimiter;
    });

    return result;
  };

  const downloadCSV = (array: any[]) => {
    const csv = convertArrayOfObjectsToCSV(array);
    if (!csv) return;

    const currentDate = new Date().toISOString().split('T')[0];
    const dynamicFilename = filename.replace('.csv', `-${currentDate}.csv`);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', dynamicFilename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={() => downloadCSV(data)}
      className="text-sm py-2 px-4 font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700"
    >
      Download CSV
    </button>
  );
};

export default ExportCSV;
