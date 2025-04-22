import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChartCard: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const timezoneOffset = today.getTimezoneOffset() * 60000;
                const localTime = new Date(today.getTime() - timezoneOffset);

                const start = localTime.toISOString().split("T")[0] + "T00:00:00";
                const end = localTime.toISOString().split("T")[0] + "T23:59:59";
                const limit = 3;

                const response = await fetch(
                    `/api/dashboard/top-services?start=${start}&end=${end}&limit=${limit}`
                );
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch data");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Default data handling
    const chartData = {
        labels: data.length ? data.map((item: any) => item.serviceType) : ["No data available"],
        datasets: [
            {
                data: data.length ? data.map((item: any) => item.total) : [100],
                backgroundColor: ["#FBBF24", "#60A5FA", "#34D399"],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "top" as const,
            },
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {loading ? (
                <>
                    {/* Loading Donut */}
                    <div className="relative h-56 flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>

                    {/* Loading Legends */}
                    <div className="mt-4 space-y-2">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </>
            ) : error ? (
                <div className="flex justify-center items-center h-56">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            ) : data.length === 0 ? (
                <div className="flex justify-center items-center h-56">
                    <p className="text-gray-500 text-sm italic">No data available</p>
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="relative h-56 flex items-center justify-center">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-center text-sm sm:text-base font-semibold text-gray-600 leading-tight">
                                Top 3<br />Services
                            </span>
                        </div>
                    </div>

                    {/* Legends */}
                    <div className="mt-4 space-y-2">
                        {data.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm sm:text-base"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                            backgroundColor: ["#FBBF24", "#60A5FA", "#34D399"][index],
                                        }}
                                    ></div>
                                    <span className="text-gray-600 truncate max-w-[140px] sm:max-w-[180px]">
                                        {item.serviceType.length > 30
                                            ? `${item.serviceType.slice(0, 25)}...`
                                            : item.serviceType}
                                    </span>
                                </div>
                                <span className="text-gray-800 font-semibold">
                                    {item.percentage.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DoughnutChartCard;
