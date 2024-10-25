import React from 'react';

const StatsCard = ({ icon, title, value, change, positive }) => {
  const upIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1"
    >
      <path
        d="M16 6L18.2136 8.29L13.4963 13.17L9.62963 9.17L2.46663 16.59L3.82963 18L9.62963 12L13.4963 16L19.5863 9.71L21.8 12V6H16Z"
        fill="#00B69B"
      />
    </svg>
  );

  const downIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1"
    >
      <path
        d="M15.9999 18L18.2136 15.71L13.4963 10.83L9.62961 14.83L2.46661 7.41L3.82961 6L9.62961 12L13.4963 8L19.5863 14.29L21.7999 12V18H15.9999Z"
        fill="#FF0000"
      />
    </svg>
  );

  return (
    <div className="flex items-center p-5 bg-white rounded-lg shadow-md">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {positive ? upIcon : downIcon} {change}% {positive ? 'Up' : 'Down'} from yesterday
        </p>
      </div>
    </div>
  );
};

export default StatsCard;

