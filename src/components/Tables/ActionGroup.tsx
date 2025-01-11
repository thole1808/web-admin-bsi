'use client';

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa"; // Default icon if no icon is passed.

type ActionGroupProps = {
  options: { label: string; icon: string; action: () => void; }[];
  icon?: React.ReactNode;
  buttonLabel?: string;
};

// Dynamically import the icon component based on icon name
const getIconComponent = (iconName: string) => {
  const iconMapping: { [key: string]: React.ElementType } = {
    check: require("react-icons/fa").FaCheck,
    trash: require("react-icons/fa").FaTrash,
    edit: require("react-icons/fa").FaEdit,
    view: require("react-icons/fa").FaEye,
  };

  return iconMapping[iconName] || FaEllipsisV;
};

const ActionGroup: React.FC<ActionGroupProps> = ({ options, icon, buttonLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: string, bottom: string }>({ top: '0', bottom: 'auto' });

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Calculate dropdown position dynamically
  const handleDropdownPosition = (e: React.MouseEvent) => {
    const buttonElement = e.currentTarget as HTMLElement;
    const rect = buttonElement.getBoundingClientRect();
    const dropdownHeight = 200; // Assuming dropdown height is fixed, or calculate dynamically

    const screenHeight = window.innerHeight;
    const bottomSpace = screenHeight - rect.bottom;  // Space available below the button
    const topSpace = rect.top;  // Space available above the button

    // If there's more space below, open dropdown below the button
    if (bottomSpace > dropdownHeight) {
      setDropdownPosition({ top: `0`, bottom: '20' });
    } else {
      // Default positioning when space is limited (place it below with slight offset)
      setDropdownPosition({ top: `20`, bottom: '0' });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          toggleDropdown(e);
          handleDropdownPosition(e); // Set dropdown position dynamically
        }}
        className="p-2 text-gray-400 hover:text-gray-500"
        aria-label="Options"
      >
        {icon ? (
          icon
        ) : (
          <FaEllipsisV />
        )}
      </button>

      {isOpen && (
        <div
          className="dropdown-menu absolute right-0 w-48 bg-white border shadow-lg rounded-md z-50"
          style={{ top: dropdownPosition.top, bottom: dropdownPosition.bottom }}
        >
          <ul className="list-none p-0 m-0">
            {options.map((option, index) => {
              const IconComponent = getIconComponent(option.icon);
              return (
                <li key={index}>
                  <button
                    onClick={() => handleOptionClick(option.action)}
                    className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left items-center"
                  >
                    <IconComponent className="mr-2 text-gray-500" />
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionGroup;
