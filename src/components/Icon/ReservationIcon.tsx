import React from "react";

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
}

const ReservationIcon: React.FC<IconProps> = ({
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
            {/* Calendar Base */}
            <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Top Lines for Dates */}
            <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Horizontal Line */}
            <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path
                d="M9 14l2 2 4-4"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export default ReservationIcon;
