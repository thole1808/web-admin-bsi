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

    const chartData = {
        labels: data.map((item: any) => item.serviceType),
        datasets: [
            {
                data: data.map((item: any) => item.total),
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
        <div className="bg-white rounded-lg shadow-md p-4">
            {loading ? (
                <div>
                    <div className="relative h-56 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {[1, 2, 3].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-56">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <div>
                    <div className="relative h-56 flex items-center justify-center">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-2 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-sm">
                                Top 3<br />Layanan
                            </span>
                        </div>
                    </div>
                    <div className="mt-4">
                        {data.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-xs mb-2"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{
                                            backgroundColor: ["#FBBF24", "#60A5FA", "#34D399"][index],
                                        }}
                                    ></div>
                                    <span className="text-gray-600">{item.serviceType}</span>
                                </div>
                                <span className="text-gray-800 font-semibold">
                                    {item.percentage.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoughnutChartCard;
