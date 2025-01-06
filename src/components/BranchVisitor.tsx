import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

interface BranchVisitor {
    branch: string;
    visitors: number;
}

const BranchVisitor: React.FC = () => {
    const [data, setData] = useState<BranchVisitor[]>([]);
    const [sortBy, setSortBy] = useState<"branch" | "visitors">("visitors");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranchVisitors = async () => {
            try {
                const today = new Date();
                const timezoneOffset = today.getTimezoneOffset() * 60000;
                const localTime = new Date(today.getTime() - timezoneOffset);

                const start = localTime.toISOString().split("T")[0] + "T00:00:00";
                const end = localTime.toISOString().split("T")[0] + "T23:59:59";
                const limit = 10;

                console.log("start", start);

                const queryParams = new URLSearchParams({
                    start,
                    end,
                    limit: limit.toString(),
                });

                const response = await fetch(
                    `/api/dashboard/branch-visitors?${queryParams.toString()}`
                );
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch branch visitors");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBranchVisitors();
    }, []);

    const handleSort = (key: "branch" | "visitors") => {
        if (key === sortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }

        const sortedData = [...data].sort((a, b) => {
            if (key === "branch") {
                return sortOrder === "asc"
                    ? a.branch.localeCompare(b.branch)
                    : b.branch.localeCompare(a.branch);
            } else {
                return sortOrder === "asc"
                    ? a.visitors - b.visitors
                    : b.visitors - a.visitors;
            }
        });
        setData(sortedData);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg pb-2">
            <h2 className="text-gray-600 text-sm font-semibold px-4 pb-2 pt-4">
                Pengunjung hari ini
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-sm shadow-sm text-xs">
                    <thead>
                        <tr className="border-b">
                            <th
                                className="py-2 px-4 text-left text-gray-600 font-medium cursor-pointer"
                                onClick={() => handleSort("branch")}
                            >
                                Cabang{" "}
                                <FaSort
                                    className={`inline ml-1 ${sortBy === "branch" ? "text-gray-800" : "text-gray-400"
                                        }`}
                                />
                            </th>
                            <th
                                className="py-2 px-4 text-left text-gray-600 font-medium cursor-pointer"
                                onClick={() => handleSort("visitors")}
                            >
                                Pengunjung{" "}
                                <FaSort
                                    className={`inline ml-1 ${sortBy === "visitors" ? "text-gray-800" : "text-gray-400"
                                        }`}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-4 px-4 text-center text-gray-500 italic"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        }`}
                                >
                                    <td className="py-2 px-4 text-gray-700">{item.branch}</td>
                                    <td className="py-2 px-4 text-gray-900 font-semibold">
                                        {item.visitors}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BranchVisitor;
