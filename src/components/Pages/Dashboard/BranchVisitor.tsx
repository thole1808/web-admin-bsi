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
    const [branchId, setbranchId] = useState<string | null>("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const userProfile = localStorage.getItem("user-profile");
          if (userProfile) {
            try {
              const parsed = JSON.parse(userProfile);
              if (parsed?.branch?.id) {
                setbranchId(parsed.branch.id.toString());
              }
            } catch (e) {
              console.error("Failed to parse user-profile", e);
            }
          }
        }
      }, []);

    useEffect(() => {
        const fetchBranchVisitors = async () => {
            try {
                const today = new Date();
                const timezoneOffset = today.getTimezoneOffset() * 60000;
                const localTime = new Date(today.getTime() - timezoneOffset);

                const start = localTime.toISOString().split("T")[0] + "T00:00:00";
                const end = localTime.toISOString().split("T")[0] + "T23:59:59";
                const limit = 10;

                const queryParams = new URLSearchParams({
                    branchId: branchId?.toString() || "",
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
        return (
            <div className="bg-white rounded-lg shadow-lg pb-2">
                <h2 className="text-gray-600 font-semibold px-4 pb-2 pt-4">
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-sm shadow-sm text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                                <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr
                                    key={index}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                    <td className="py-2 px-4">
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="font-semibold">
                Today Visitors
            </h2>
            <div className="overflow-x-auto -mx-4 mt-2">
                <table className="min-w-full bg-white rounded-sm shadow-sm text-sm">
                    <thead>
                        <tr className="border-b">
                            <th
                                className="py-2 px-4 text-left text-gray-600 font-medium cursor-pointer"
                                onClick={() => handleSort("branch")}
                            >
                                Branch{" "}
                                <FaSort
                                    className={`inline ml-1 ${sortBy === "branch" ? "text-gray-800" : "text-gray-400"
                                        }`}
                                />
                            </th>
                            <th
                                className="py-2 text-left text-gray-600 font-medium cursor-pointer"
                                onClick={() => handleSort("visitors")}
                            >
                                Queues{" "}
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
                                    <td className="py-2 pl-2 pr-6 text-gray-900 font-semibold text-right">
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
