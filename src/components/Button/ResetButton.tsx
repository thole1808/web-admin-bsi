import React from "react";
import { FaRotateLeft } from "react-icons/fa6";

interface ResetButtonProps {
  onClick: () => void; // Fungsi yang akan dijalankan ketika tombol diklik
  className?: string; // Kelas tambahan untuk styling
  label?: string; // Label untuk tombol
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick, className = "", label = "Reset" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-4 border rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 border-gray-300 transition-colors ${className}`}
    >
      <FaRotateLeft className="w-3 h-3" />
      {label}
    </button>
  );
};

export default ResetButton;
