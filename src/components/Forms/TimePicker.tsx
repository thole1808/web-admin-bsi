import React, { useState } from "react";

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  error?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = "",
  error,
}) => {
  const [timeValue, setTimeValue] = useState<string>(value || "");
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleBlur = () => {
    if (required && !timeValue) {
      setLocalError("This field is required.");
    } else {
      setLocalError(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    onChange(newTime);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
          localError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {(localError || error) && <p className="text-red-500 text-xs mt-1">{localError || error}</p>}
    </div>
  );
};

export default TimePicker;
