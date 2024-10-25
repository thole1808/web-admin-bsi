
import React from 'react';

const StatsCard = ({ icon, title, value, change, positive }) => {
  return (
    <div className="flex items-center p-5 bg-white rounded-lg shadow-md">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? '▲' : '▼'} {change}% Up from yesterday
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
