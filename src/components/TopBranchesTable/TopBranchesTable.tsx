import React, { useEffect, useState } from 'react';

const TopBranchesTable = () => {
  const [topBranches, setTopBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopBranches = async () => {
      try {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        const localTime = new Date(today.getTime() - timezoneOffset);
        const limit = 5;

        const start = new Date(localTime.getFullYear(), localTime.getMonth(), 1)
          .toISOString()
          .split('T')[0] + 'T00:00:00';
        const end = localTime.toISOString().split('T')[0] + 'T23:59:59';

        const queryParams = new URLSearchParams({
          start,
          end,
          limit: limit.toString(),
        });

        const response = await fetch(`/api/dashboard/top-branches?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setTopBranches(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch top branches');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBranches();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!topBranches || topBranches.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">5 Cabang Terbaik</h3>
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-green-50 text-left">
            <th className="px-4 py-2">Nama Cabang</th>
            <th className="px-4 py-2">Prosentase Total Antrian</th>
            <th className="px-4 py-2 text-center">Terlayani</th>
            <th className="px-4 py-2 text-center">Tidak Terlayani</th>
            <th className="px-4 py-2 text-center">Menunggu</th>
            <th className="px-4 py-2 text-center">Dilayani</th>
          </tr>
        </thead>
        <tbody>
          {topBranches.map((branch: any, index: number) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-4 py-3">{branch.branch}</td>
              <td className="px-4 py-3">
                {branch.percentage.toFixed(2)}% dari total {branch.total} antrian
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-green-100 text-green-700 px-12 py-1 rounded-full">{branch.served}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-red-100 text-red-700 px-12 py-1 rounded-full">{branch.unserved}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-yellow-100 text-yellow-700 px-12 py-1 rounded-full">{branch.waiting || 0}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-blue-100 text-blue-700 px-12 py-1 rounded-full">{branch.pending || 0}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopBranchesTable;
