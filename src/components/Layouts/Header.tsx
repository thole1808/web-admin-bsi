import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from Next.js
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

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
    const { data: session } = useSession();

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

    const navigateToProfile = () => {
        setDropdownOpen(false); // Close dropdown before navigating
    };

    const handleLogout = () => {
        setDropdownOpen(false); // Close dropdown before logout
        signOut(); // Use next-auth's signOut function
    };

    // Make sure component is rendered on the client-side
    if (!isClient) return null;

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md w-full">
            <div className="w-full px-6 py-3 flex items-center justify-between border-b">
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
                                {session?.user?.name || 'Admin'}
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
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                                    onClick={navigateToProfile}
                                >
                                    <FaUserCircle className="inline-block mr-2 text-gray-500 h-4 w-4" />Profil
                                </span>
                            </Link>
                            <div className="border-t border-gray-200" />
                            <span
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="inline-block mr-2 text-gray-500 h-4 w-4" />Logout
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
