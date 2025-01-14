import React, { useState } from 'react';

const TodayVisitors = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'branch', direction: 'asc' });
  
  const todayVisitors = [
    { branch: 'Pasar Senen', total: 76 },
    { branch: 'Margonda', total: 67 },
    { branch: 'Cempaka Mas', total: 45 },
    { branch: 'Kota Wisata', total: 42 },
    { branch: 'Rawamangun', total: 36 },
    { branch: 'Pulo Gadung', total: 30 },
    { branch: 'Pramuka', total: 12 },
  ];

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort visitors based on the current sort configuration
  const sortedVisitors = [...todayVisitors].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Update icon logic with larger arrows
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▴' : '▾';
    }
    return '▴▾'; // Default icon before sorting
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pb-2 cursor-pointer" onClick={() => handleSort('branch')}>
              Cabang <span style={{ fontSize: '12px', marginLeft: '5px' }}>{getSortIcon('branch')}</span>
            </th>
            <th className="text-right pb-2 cursor-pointer" onClick={() => handleSort('total')}>
              Total Visitors <span style={{ fontSize: '14px', marginLeft: '5px' }}>{getSortIcon('total')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVisitors.map((visitor, index) => (
            <tr key={index}>
              <td className="py-1 underline">{visitor.branch}</td>
              <td className="py-1 text-right underline">{visitor.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayVisitors;
