import React from "react";

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
}

const DashboardIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = "#007C80",
}) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9L21 20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22L5 22C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20L3 9Z"
                stroke="#007C80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M9 22L9 12L15 12L15 22"
                stroke="#007C80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    );
};

export default DashboardIcon;
