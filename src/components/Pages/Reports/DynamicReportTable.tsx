import CustomLoader from '@/components/Tables/CustomLoader';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import ReportPDF from './ReportPDF';
import ReportExcel from './ReportExcel';

interface DynamicReportTableProps {
    title: string;
    apiUrl: string;
    period?: string;
    onLoaded?: () => void;
}

const DynamicReportTable = ({ title, apiUrl, period, onLoaded }: DynamicReportTableProps) => {
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

            console.log('Fetching data from:', apiUrl);
            try {
                const size = perPage.toString();
                const page = (currentPage - 1).toString();
                const response = await fetch(apiUrl + `&size=${size}&page=${page}`);
                const result = await response.json();

                if (result.success) {
                    if (result.data.details.content.length === 0) {
                        throw new Error('No data available');
                    }

                    const keys = Object.keys(result.data.details.content[0]);

                    // Dynamically generate columns based on keys
                    const generatedColumns: TableColumn<any>[] = keys.map((key) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column name
                        selector: (row) => row[key],
                        sortable: true,
                    }));

                    setColumns(generatedColumns);
                    setData(result.data.details.content);
                    setTotalRows(result.data.details.totalElements);
                } else {
                    throw new Error(result.message || 'Failed to fetch data');
                }
            } catch (err) {
                if (err.message !== 'No data available')
                    setError(err.message);
            } finally {
                setLoading(false);
                if (onLoaded) onLoaded();
            }
        };

        if (apiUrl)
            fetchData();
    }, [perPage, currentPage]);

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
                    <h2 className="text-md font-medium text-gray-800">
                        Preview: {title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Period: {period}</p>
                </div>
                <div className="flex items-center space-x-1">
                    {data.length > 0 && (
                        <>
                            <ReportPDF
                                title={title}
                                period={period || ''}
                                apiUrl={apiUrl}
                            />
                            <ReportExcel
                                title={title}
                                apiUrl={apiUrl}
                            />
                        </>
                    )}
                </div>
            </div>
            {data.length > 0 && (
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
            )}
            {data.length === 0 && (
                <p className="text-center text-gray-500 mt-6">No data available</p>
            )}

        </div>
    );
};

export default DynamicReportTable;
