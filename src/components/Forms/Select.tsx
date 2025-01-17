import React, { useState } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  className = '',
  size = 'sm',
  disabled = false,
}) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleBlur = () => {
    if (required && (value === undefined || value === '')) {
      setLocalError('This field is required.');
    } else {
      setLocalError(undefined);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block text-${size} font-medium text-gray-700 mb-1`}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          className={`text-${size} w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none text-gray-700
            ${localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {(localError || error) && <p className="text-red-500 text-xs mt-1">{localError || error}</p>}
    </div>
  );
};

export default Select;
