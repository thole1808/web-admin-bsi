import React, { useState, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa"; // The three dots icon

type ActionGroupProps = {
  options: { label: string; action: () => void }[]; // List of options and corresponding actions
  icon?: React.ReactNode; // Optional icon for the dropdown trigger
  buttonLabel?: string; // Optional button label, in case you want to customize the button text
};

const ActionGroup: React.FC<ActionGroupProps> = ({ options, icon, buttonLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null); // Reference to the dropdown menu to handle outside click

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from propagating to the parent elements (important for handling outside click)
    setIsOpen(!isOpen);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  // Attach and clean up the event listener for clicks outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-600 hover:text-gray-900"
        aria-label="Options"
      >
        {icon ? (
          icon // Use custom icon passed via prop
        ) : (
          <FaEllipsisV /> // Default "three dots" icon if no icon prop is passed
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
          <ul className="list-none p-0 m-0">
            {options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={option.action}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionGroup;
