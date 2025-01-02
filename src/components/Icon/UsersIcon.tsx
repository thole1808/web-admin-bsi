import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const UsersIcon: React.FC<IconProps> = ({
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
      <circle cx="7" cy="7" r="4" fill={color} />
      <circle cx="17" cy="7" r="4" fill={color} />
      <path
        d="M4 18c0-2.21 2.25-4 5-4h6c2.75 0 5 1.79 5 4"
        fill={color}
      />
    </svg>
  );
};

export default UsersIcon;
