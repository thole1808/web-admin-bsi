
import React from 'react';

const VisitorsChart = () => {
  const branches = [
    { name: 'P. Senen', served: 60, total: 80, notServed: 20 },
    { name: 'Margonda', served: 50, total: 70, notServed: 20 },
    { name: 'Pramuka', served: 20, total: 30, notServed: 10 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Pengunjung</h3>
      <div className="space-y-2">
        {branches.map((branch, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">{branch.name}</span>
            <div className="w-2/3 bg-gray-200 rounded-full h-4 mx-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${(branch.served / branch.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{branch.served} / {branch.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorsChart;
