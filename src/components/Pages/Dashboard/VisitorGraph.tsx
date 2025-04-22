import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisitorGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("today");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        const localTime = new Date(today.getTime() - timezoneOffset);
        const limit = 10;

        let start = localTime.toISOString().split("T")[0] + "T00:00:00";
        let end = localTime.toISOString().split("T")[0] + "T23:59:59";

        if (timeRange === "this week") {
          const startOfWeek = new Date(localTime);
          startOfWeek.setDate(localTime.getDate() - localTime.getDay()); // Mulai dari hari Minggu
          startOfWeek.setHours(0, 0, 0, 0);
          start = startOfWeek.toISOString().split("T")[0] + "T00:00:00";
        } else if (timeRange === "this month") {
          // Salin localTime untuk menghitung startOfMonth
          const startOfMonth = new Date(localTime.getFullYear(), localTime.getMonth(), 1);
          startOfMonth.setHours(0, 0, 0, 0);
          start = startOfMonth.toISOString().split("T")[0] + "T00:00:00";
        }

        if (start && end) {
          const queryParams = new URLSearchParams({
            start,
            end,
            limit: limit.toString(),
          });

          const response = await fetch(`/api/dashboard/top-branches?${queryParams.toString()}`);
          const result = await response.json();

          if (result.success) {
            setData(result.data);
          } else {
            throw new Error(result.message || "Failed to fetch top branches");
          }
        } else {
          throw new Error("Invalid time range");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const chartData = {
    labels: data.map((item: any) => item.branch),
    datasets: [
      {
        label: "Total Visitors",
        data: data.map((item: any) => item.total),
        backgroundColor: "#C9D8F1",
        borderRadius: 5,
        barThickness: 30,
      },
      {
        label: "Completed",
        data: data.map((item: any) => item.served),
        backgroundColor: "#C2F2EF",
        borderRadius: 5,
        barThickness: 30,
      },
      {
        label: "Missed",
        data: data.map((item: any) => item.unserved),
        backgroundColor: "#F4A8A8",
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Cabang",
        },
      },
      y: {
        title: {
          display: false,
          text: "Jumlah",
        },
      },
    },
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h4 className="text-gray-700 text-lg font-semibold">
          {loading ? (
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            "Visitor Statistics"
          )}
        </h4>

        {loading ? (
          <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
        ) : (
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="today">Today</option>
            <option value="this week">This Week</option>
            <option value="this month">This Month</option>
          </select>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative h-[20rem] sm:h-[22rem]">
        {loading ? (
          <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 italic text-sm">No data available</p>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default VisitorGraph;
