"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    // name: "MENU",
    menuItems: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9L21 20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22L5 22C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20L3 9Z" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 22L9 12L15 12L15 22" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0718 0C17.9098 0 16.9081 0.842804 16.5075 2.00668C18.03 2.68895 19.192 4.17389 19.5926 5.9799C20.8347 5.69896 21.7562 4.49496 21.7562 3.05015C21.7562 1.32441 20.5542 0 19.0718 0Z" fill="#007C80" />
            <path d="M21.5559 7.1438C21.035 7.6254 20.394 7.94647 19.6728 8.06687C19.5526 9.15048 19.1519 10.1538 18.5509 10.9565H22.9983C23.5593 10.9565 24 10.515 24 9.95315V9.47154C24 8.38794 22.798 7.70567 21.5559 7.1438Z" fill="#007C80" />
            <path d="M17.3088 12C16.5075 12.7224 15.5058 13.1639 14.424 13.1639C14.3439 14.408 13.9833 15.5318 13.4223 16.495H19.0317C19.6728 16.495 20.2337 15.9732 20.2337 15.291V14.8093C20.1936 13.4849 18.7512 12.6823 17.3088 12Z" fill="#007C80" />
            <path d="M12.1402 18.1004C11.0184 19.2241 9.49583 19.8663 7.89316 19.8663C6.25042 19.8663 4.72788 19.184 3.60601 18.0201C1.76294 18.9031 0 20.0268 0 21.6723L0 22.4348C0 23.3178 0.721202 24 1.56261 24L14.1035 24C14.985 24 15.6661 23.2776 15.6661 22.4348V21.7124C15.6661 20.0268 13.9833 18.9432 12.1402 18.1004Z" fill="#007C80" />
            <path d="M7.85307 17.378C10.2208 17.378 12.1402 15.2577 12.1402 12.6423C12.1402 10.0268 10.2208 7.90649 7.85307 7.90649C5.48534 7.90649 3.56592 10.0268 3.56592 12.6423C3.56592 15.2577 5.48534 17.378 7.85307 17.378Z" fill="#007C80" />
            <path d="M14.3038 3.77258C12.8213 3.77258 11.5793 4.85619 11.2187 6.38126C12.7011 7.34447 13.7829 8.98994 14.2237 10.8762C14.2637 10.8762 14.2637 10.8762 14.3038 10.8762C16.0667 10.8762 17.5091 9.27088 17.5091 7.30433C17.5492 5.37792 16.1068 3.77258 14.3038 3.77258Z" fill="#007C80" />
          </svg>
        ),
        label: "Antrian",
        route: "/antrian",
      },
      {
        icon: (
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13L5 13C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17L1 19" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M23 19V17C22.9993 16.1137 22.7044 15.2528 22.1614 14.5523C21.6184 13.8519 20.8581 13.3516 20 13.13" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 1.13C16.8604 1.35031 17.623 1.85071 18.1676 2.55232C18.7122 3.25392 19.0078 4.11683 19.0078 5.005C19.0078 5.89318 18.7122 6.75608 18.1676 7.45769C17.623 8.1593 16.8604 8.6597 16 8.88" stroke="#007C80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ),
        label: "Cabang",
        route: "",
      },
      {
        icon: (
          <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.857143C0 0.384 0.371637 0 0.829546 0L17.4205 0C17.8784 0 18.25 0.384 18.25 0.857143L18.25 23.1429C18.25 23.616 17.8784 24 17.4205 24L0.829546 24C0.371637 24 0 23.616 0 23.1429L0 0.857143ZM1.65909 1.71429L1.65909 22.2857L16.5909 22.2857L16.5909 1.71429L1.65909 1.71429ZM9.125 10.2857C11.8716 10.2857 14.1023 12.5906 14.1023 15.4286C14.1023 18.2666 11.8716 20.5714 9.125 20.5714C6.37838 20.5714 4.14773 18.2666 4.14773 15.4286C4.14773 12.5906 6.37838 10.2857 9.125 10.2857ZM9.95455 12.108C11.3847 12.4894 12.4432 13.8326 12.4432 15.4286C12.4432 17.3211 10.9566 18.8571 9.125 18.8571C7.58039 18.8571 6.28049 17.7634 5.91134 16.2857L9.125 16.2857C9.58291 16.2857 9.95455 15.9017 9.95455 15.4286V12.108ZM11.6136 8.57143H6.63636C6.17845 8.57143 5.80682 8.18743 5.80682 7.71429C5.80682 7.24114 6.17845 6.85714 6.63636 6.85714L11.6136 6.85714C12.0715 6.85714 12.4432 7.24114 12.4432 7.71429C12.4432 8.18743 12.0715 8.57143 11.6136 8.57143ZM13.2727 5.14286L4.97727 5.14286C4.51936 5.14286 4.14773 4.75886 4.14773 4.28571C4.14773 3.81257 4.51936 3.42857 4.97727 3.42857L13.2727 3.42857C13.7306 3.42857 14.1023 3.81257 14.1023 4.28571C14.1023 4.75886 13.7306 5.14286 13.2727 5.14286Z" fill="#007C80" />
          </svg>
        ),
        label: "Reporting",
        route: "",
      }
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/Bank_Syariah_Indonesia.svg"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold" style={{ color: "#00BFB2" }}>
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <li key={menuIndex} style={{ color: "#00BFB2" }}>
                      <SidebarItem
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>

      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
