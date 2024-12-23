import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const RolesIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#007C80",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
        fill={color}
      />
      <path
        d="M6 8C6 6.79 7.79 5 9.99 5C12.21 5 14 6.79 14 8C14 9.21 12.21 11 9.99 11C7.79 11 6 9.21 6 8z"
        fill={color}
      />
      <path
        d="M4 18c0-2.21 2.25-4 5-4h6c2.75 0 5 1.79 5 4"
        fill={color}
      />
      <path d="M14 14h2" stroke={color} strokeWidth="2" />
      <path d="M8 14h2" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default RolesIcon;
