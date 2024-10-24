import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  children,
}) => {
  // Ubah rate menjadi number
  const rateNumber = parseFloat(rate);

  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-md">
      {/* Left Section (Icon) */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        {children}
      </div>

      {/* Middle Section (Text) */}
      <div className="ml-4 flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <h4 className="my-1 text-2xl font-semibold text-gray-900">{total}</h4>
        <div
          className={`mt-1 flex items-center text-sm font-semibold ${
            rateNumber >= 10 ? "text-red-600" : "text-green-600"
          }`}
        >
          {rateNumber >= 10 ? (
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
          ) : (
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
          )}
          <span>{rate}%</span>
          <span className="text-gray-500 ml-1">
            {rateNumber >= 10 ? "Down From Yesterday " : "Up From Yesterday"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
