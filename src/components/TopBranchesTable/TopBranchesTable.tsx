import React from 'react';

const TopBranchesTable = () => {
  const topBranches = [
    { branch: 'Pasar Senen', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Margonda', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
    { branch: 'Cempaka Mas', percentage: '89%', total: 45, served: 42, notServed: 3, waiting: 5, inService: 5 },
  ];

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-semibold mb-4">5 Cabang Terbaik</h3>
      <table className="w-full text-sm table-auto border-collapse">
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
          {topBranches.map((branch, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-4 py-3">{branch.branch}</td>
              <td className="px-4 py-3">
                {branch.percentage} dari total {branch.total} antrian
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{branch.served}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">{branch.notServed}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">{branch.waiting}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{branch.inService}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopBranchesTable;
