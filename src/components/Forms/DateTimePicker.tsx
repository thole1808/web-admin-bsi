import React, { useState } from 'react';

interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  disableTime?: boolean;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  disableTime = false,
  className = '',
}) => {
  const [dateValue, setDateValue] = useState<string>(value || '');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const datePart = e.target.value;
    if (!disableTime) {
      const timePart = dateValue.split('T')[1] || '00:00';
      const newValue = `${datePart}T${timePart}`;
      setDateValue(newValue);
      onChange(newValue.split('T')[0]);
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
    onChange(newValue.split('T')[0]);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex space-x-4">
        {/* Date Input */}
        <input
          type="date"
          value={dateValue.split('T')[0]}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
        />
        {/* Time Input (optional) */}
        {!disableTime && (
          <input
            type="time"
            value={dateValue.split('T')[1] || ''}
            onChange={handleTimeChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
          />
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
