import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const SettingsIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#007C80",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="12" cy="5" rx="9" ry="4" stroke={color} strokeWidth="2" />
      <path
        d="M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="12" cy="19" rx="9" ry="4" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default SettingsIcon;
