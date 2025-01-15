import React, { useState } from 'react';

interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  disableTime?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  disableTime = false,
  required = false,
  className = '',
  error,
}) => {
  const [dateValue, setDateValue] = useState<string>(value || '');
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleBlur = () => {
    if (required && !dateValue) {
      setLocalError('This field is required.');
    } else {
      setLocalError(undefined);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const datePart = e.target.value;
    if (!disableTime) {
      const timePart = dateValue.split('T')[1] || '00:00';
      const newValue = `${datePart}T${timePart}`;
      setDateValue(newValue);
      onChange(newValue);
    } else {
      setDateValue(datePart);
      onChange(datePart);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timePart = e.target.value;
    const datePart = dateValue.split('T')[0] || new Date().toISOString().split('T')[0];
    const newValue = `${datePart}T${timePart}`;
    setDateValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex space-x-4">
        {/* Date Input */}
        <input
          type="date"
          value={dateValue.split('T')[0]}
          onChange={handleDateChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
            localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {/* Time Input (optional) */}
        {!disableTime && (
          <input
            type="time"
            value={dateValue.split('T')[1] || ''}
            onChange={handleTimeChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
              localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
        )}
      </div>
      {(localError || error) && <p className="text-red-500 text-xs mt-1">{localError || error}</p>}
    </div>
  );
};

export default DateTimePicker;
