"use client";

import React, { useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { BuildingLibraryIcon, IdentificationIcon } from '@heroicons/react/24/solid';
import { FaBuildingShield } from 'react-icons/fa6';
import { UserCircleIcon } from 'lucide-react';

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
    const { data: session } = useSession();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setDropdownOpen]);

    const navigateToProfile = () => {
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        signOut({ callbackUrl: '/login' });
    };

    // Ambil branch dan role info dari session
    const branchInfo = session?.user?.branch ?? null;
    const roleInfo = session?.user?.role ?? null;
    let branchName = null;
    let branchCode = null;

    if (branchInfo?.type === 'BRANCH') {
        branchCode = branchInfo.code;
        branchName = branchInfo.name;
    } else if (branchInfo?.type === 'AREA') {
        branchCode = branchInfo.areaCode;
        branchName = branchInfo.areaName;
    } else if (branchInfo?.type === 'REGION') {
        branchCode = branchInfo.regionCode;
        branchName = branchInfo.regionName;
    }

    return (
        <div className="sticky top-0 z-50 bg-white w-full">
            <div className="w-full px-6 py-3 flex py-5 items-center justify-end border-b shadow">
                <div className="text-sm text-gray-600 mr-auto flex space-x-8">
                    {branchCode && (
                        <span className='flex items-center gap-2'>
                            <BuildingLibraryIcon className='h-6 w-6' />
                            <div>
                                <p className='text-xs'>{branchCode}</p>
                                <p className='font-medium'>{branchName}</p>
                            </div>
                        </span>
                    )}
                    {roleInfo && (
                        <span className='flex items-center gap-2'>
                            <UserCircleIcon className='h-6 w-6' />
                            <div>
                                <p className='text-xs'>{roleInfo.code}</p>
                                <p className='font-medium'>{roleInfo.name}</p>
                            </div>
                        </span>
                    )}
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
                            <span className="font-medium text-gray-700">
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
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 text-sm border border-gray-200 dark:border-gray-700">
                        <Link href="/profile">
                          <span
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                            onClick={navigateToProfile}
                          >
                            <FaUserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            Profil Saya
                          </span>
                        </Link>
                      
                        <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                      
                        <span
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 transition-colors duration-200 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="h-4 w-4 text-red-500 dark:text-red-400" />
                          Keluar
                        </span>
                      </div>
                      
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
