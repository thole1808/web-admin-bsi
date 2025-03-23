import React from "react";

type CreateButtonProps = {
  size?: "sm" | "md" | "lg" | "xl" | "xs";
  label?: string;
  onClick?: () => void;
};

const CreateButton: React.FC<CreateButtonProps> = ({ size = "sm", label = "Create", onClick }) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
    xs: "px-2 py-1 text-sm",
  };

  const buttonSizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 rounded bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 ${buttonSizeClass}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default CreateButton;
