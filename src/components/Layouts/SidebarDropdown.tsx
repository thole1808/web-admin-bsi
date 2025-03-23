import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Import Link from next/link for client-side routing

type ChildItem = {
  route: string;
  label: string;
  icon?: React.ReactNode;
};

type SidebarDropdownProps = {
  item: ChildItem[];
};

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item }) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-2">
      {item.map((child, index) => {
        const isActive = child.route === pathname;

        return (
          <li key={index}>
            <Link href={child.route} passHref>
              <div
                className={`flex items-center gap-x-2 cursor-pointer px-4 py-3 font-medium rounded-md duration-300 ${
                  isActive
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "text-[#00BFB2] hover:bg-teal-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-x-2">
                  {child.icon && (
                    <span
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-inherit"
                      } transition-colors duration-300`}
                    >
                      {child.icon}
                    </span>
                  )}
                  <span className="flex-1">{child.label}</span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarDropdown;
