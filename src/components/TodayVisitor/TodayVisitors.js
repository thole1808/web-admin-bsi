
import React from 'react';

const TodayVisitors = () => {
  const todayVisitors = [
    { branch: 'Pasar Senen', total: 76 },
    { branch: 'Margonda', total: 67 },
    { branch: 'Cempaka Mas', total: 45 },
    { branch: 'Kota Wisata', total: 42 },
    { branch: 'Rawamangun', total: 36 },
    { branch: 'Pulo Gadung', total: 30 },
    { branch: 'Pramuka', total: 12 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pb-2">Cabang</th>
            <th className="text-right pb-2">Total Pengunjung</th>
          </tr>
        </thead>
        <tbody>
          {todayVisitors.map((visitor, index) => (
            <tr key={index}>
              <td className="py-1">{visitor.branch}</td>
              <td className="py-1 text-right">{visitor.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayVisitors;
