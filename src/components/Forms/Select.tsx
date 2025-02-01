import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState, useRef, useEffect, use } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(
    options.find((option) => option.value === value)?.label
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === "")
      setSelectedLabel("");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlur = () => {
    if (required && (value === undefined || value === '')) {
      setLocalError('This field is required.');
    } else {
      setLocalError(undefined);
    }
  };

  const handleSelect = (selectedValue: string | number) => {
    const selectedOption = options.find((option) => option.value === selectedValue);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
      setSearchTerm(''); // Reset pencarian
    }
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedLabel(undefined);
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-${size} font-medium text-gray-700 mb-1`}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {/* Input untuk pencarian */}
        <input
          type="text"
          value={isOpen ? searchTerm : selectedLabel || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`text-${size} w-full px-3 py-2 pr-8 border rounded-md shadow-sm focus:ring-2 focus:outline-none text-gray-700
            ${localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
          disabled={disabled}
        />

        {/* Tombol Clear */}
        {selectedLabel && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
            aria-label="Clear selection"
          >
            <XMarkIcon className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Dropdown untuk opsi */}
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`text-${size} px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-900`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className={`text-${size} px-4 py-2 text-gray-500`}>No options found</li>
            )}
          </ul>
        )}
      </div>
      {(localError || error) && <p className={`text-${size} text-red-500 text-xs mt-1`}>{localError || error}</p>}
    </div>
  );
};

export default Select;
