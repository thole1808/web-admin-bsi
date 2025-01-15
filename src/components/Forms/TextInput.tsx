import React, { useState } from 'react';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange?: (value: string) => void;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  prefixIcon,
  suffixIcon,
  error,
  required = false,
  disabled = false,
  className = '',
  size = 'sm',
}) => {
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleBlur = () => {
    if (required && !value) {
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
      <div className="relative flex items-center">
        {/* Prefix Icon */}
        {prefixIcon && (
          <span
            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
              disabled ? 'text-gray-300' : 'text-gray-400'
            }`}
          >
            {prefixIcon}
          </span>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`text-${size} w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none text-gray-700
            ${prefixIcon ? 'pl-10' : ''} ${suffixIcon ? 'pr-10' : ''}
            ${localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />

        {/* Suffix Icon */}
        {suffixIcon && (
          <span
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
              disabled ? 'text-gray-300' : 'text-gray-400'
            }`}
          >
            {suffixIcon}
          </span>
        )}
      </div>

      {/* Error Message */}
      {(localError || error) && <p className="text-red-500 text-xs mt-1">{localError || error}</p>}
    </div>
  );
};

export default TextInput;
