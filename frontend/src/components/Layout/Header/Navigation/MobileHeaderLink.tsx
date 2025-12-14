"use client";

import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const MobileHeaderLink: React.FC<{
  item: HeaderItem;
  onClick?: () => void;
}> = ({ item, onClick }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const isActive =
    path === item.href ||
    path.startsWith(item.href + "/");

  return (
    <div className="relative w-full">
      {/* MAIN LINK */}
      <Link
        href={item.href}
        onClick={() => {
          if (item.submenu) {
            setSubmenuOpen(!submenuOpen);
          } else {
            onClick?.(); // 👈 INI YANG MENUTUP SIDEBAR
          }
        }}
        className={`
    flex items-center justify-between w-full
    px-4 py-3 rounded-lg
    text-white transition-all duration-300
    ${isActive ? "bg-[#470000B3]" : "hover:bg-[#470000B3]"}
  `}
      >

        <span>{item.label}</span>

        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.3em"
            height="1.3em"
            viewBox="0 0 24 24"
            className={`transition-transform ${submenuOpen ? "rotate-180" : ""
              }`}
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {/* SUBMENU */}
      {submenuOpen && item.submenu && (
        <div className="mt-2 ml-2 flex flex-col gap-1">
          {item.submenu.map((subItem, index) => {
            const cleanPath = path.replace(/\/$/, "");
            const cleanSubHref = subItem.href.replace(/\/$/, "");

            const isSubActive =
              cleanPath === cleanSubHref ||
              (cleanSubHref !== item.href &&
                cleanPath.startsWith(cleanSubHref + "/"));

            return (
              <Link
                key={index}
                href={subItem.href}
                onClick={onClick}

                className={`
                  px-4 py-2 rounded-lg text-sm
                  text-white transition-all duration-300
                  ${isSubActive
                    ? "bg-[#470000B3]"
                    : "hover:bg-[#470000B3]"
                  }
                `}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
