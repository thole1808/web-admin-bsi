import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from Next.js

interface DropdownItem {
    id: number;
    name: string;
    avatar: string;
}

type HeaderProps = {
    selectedItem: DropdownItem | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<DropdownItem | null>>;
    dropdownOpen: boolean;
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({
    selectedItem,
    setSelectedItem,
    dropdownOpen,
    setDropdownOpen,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (isClient) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            if (isClient) {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, [isClient, dropdownOpen]);

    const handleItemClick = (item: DropdownItem) => {
        setSelectedItem(item);
        setDropdownOpen(false);
    };

    const navigateToProfile = () => {
        setDropdownOpen(false); // Close dropdown before navigating
    };

    const navigateToUpdatePassword = () => {
        setDropdownOpen(false); // Close dropdown before navigating
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setDropdownOpen(false); // Close dropdown before logout
    };

    // Make sure component is rendered on the client-side
    if (!isClient) return null;

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md w-full">
            <div className="w-full px-6 py-3 flex items-center justify-between border-b">
                {/* Search Box */}
                <div className="flex items-center space-x-4">
                    <div className="relative w-full max-w-xl flex items-center">
                        <input
                            type="text"
                            placeholder="Cari disini.."
                            className="w-[400px] px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 50"
                            width="16px"
                            height="16px"
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            <path
                                d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
                            />
                        </svg>
                    </div>
                </div>

                {/* User Dropdown */}
                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-6 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="flex items-center gap-2">
                            <Image
                                src="/images/logo/48.png"
                                alt="User Avatar"
                                width={24}
                                height={24}
                                priority
                            />
                            <span className="font-medium text-sm text-gray-700">
                                {selectedItem?.name || 'Admin'}
                            </span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 text-sm">
                            {/* Use Link without <a> */}
                            <Link href="/profile">
                                <span
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    onClick={navigateToProfile}
                                >
                                    Profil
                                </span>
                            </Link>
                            <Link href="/update-password">
                                <span
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    onClick={navigateToUpdatePassword}
                                >
                                    Update Password
                                </span>
                            </Link>
                            <span
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
