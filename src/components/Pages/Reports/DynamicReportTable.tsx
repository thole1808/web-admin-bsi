import CustomLoader from '@/components/Tables/CustomLoader';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';

interface DynamicReportTableProps {
    title: string;
    apiUrl: string;
    onLoaded?: () => void;
}

const DynamicReportTable = ({ title, apiUrl, onLoaded }: DynamicReportTableProps) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState<TableColumn<any>[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const size = perPage.toString();
                const page = (currentPage - 1).toString();
                const response = await fetch(apiUrl + `?size=${size}&page=${page}`);
                const result = await response.json();

                if (result.success) {
                    const keys = Object.keys(result.data.content[0]);

                    // Dynamically generate columns based on keys
                    const generatedColumns: TableColumn<any>[] = keys.map((key) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column name
                        selector: (row) => row[key],
                        sortable: true,
                    }));

                    setColumns(generatedColumns);
                    setData(result.data.content);
                } else {
                    throw new Error(result.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
                if (onLoaded) onLoaded();
            }
        };

        fetchData();
    }, [apiUrl, onLoaded]);

    // Download handlers
    const handleDownloadPdf = () => {
        // Logic to download PDF
        console.log('Downloading PDF...');
    };

    const handleDownloadExcel = () => {
        // Logic to download Excel
        console.log('Downloading Excel...');
    };

    const handleDownloadCsv = () => {
        // Logic to download CSV
        console.log('Downloading CSV...');
    };

    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (error)
        return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="px-4 py-6 bg-white rounded-lg">
            <div className="flex items-center justify-between border-b pb-2">
                <div>
                    <p className="text-xs text-gray-400">Report Generated</p>
                    <h2 className="text-md font-medium text-gray-800">
                        {title}
                    </h2>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center px-3 py-2 text-xs rounded"
                    >
                        <FaFilePdf className="mr-2" />
                        PDF
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center px-3 py-2 text-xs rounded"
                    >
                        <FaFileExcel className="mr-2" />
                        Excel
                    </button>
                    <button
                        onClick={handleDownloadCsv}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center px-3 py-2 text-xs rounded"
                    >
                        <FaFileCsv className="mr-2" />
                        CSV
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                progressComponent={<CustomLoader />}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                highlightOnHover
                striped
            />
        </div>
    );
};

export default DynamicReportTable;
