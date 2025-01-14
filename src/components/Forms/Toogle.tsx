import React, { useState } from 'react';

interface ToggleInputProps {
  label?: string;
  initialValue?: boolean;
  onChange?: (newValue: boolean) => void;
}

const ToggleInput: React.FC<ToggleInputProps> = ({ label, initialValue = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${
          isChecked ? 'bg-green-500' : 'bg-gray-300'
        }`}
        onClick={handleToggle}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isChecked ? 'translate-x-4' : 'translate-x-0'
          }`}
        ></div>
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
};

export default ToggleInput;
