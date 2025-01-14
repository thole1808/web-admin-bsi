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

const GrafikPengunjung = () => {
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-gray-600 text-sm font-semibold">
          {loading ? (
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            "Visitor Statistics"
          )}
        </h4>
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-xs text-gray-700"
          >
            <option value="today">Today</option>
            <option value="this week">This Week</option>
            <option value="this month">This Month</option>
          </select>
        )}
      </div>
      <div className="h-80 flex items-center justify-center">
        {loading ? (
          <div className="w-full h-full bg-gray-200 rounded animate-pulse"></div>
        ) : data.length === 0 ? (
          <p className="text-gray-500 italic">No data available</p>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>

  );
};

export default GrafikPengunjung;
