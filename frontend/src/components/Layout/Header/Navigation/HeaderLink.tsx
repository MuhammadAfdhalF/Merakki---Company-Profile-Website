"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  // Normalize path
  const cleanPath = path.replace(/\/$/, "");
  const cleanHref = item.href.replace(/\/$/, "");

  // Active state logic
  let isActive = false;

  if (cleanHref === "") {
    isActive = cleanPath === "";
  } else {
    isActive = cleanPath === cleanHref || cleanPath.startsWith(cleanHref + "/");
  }

  const handleMouseEnter = () => item.submenu && setSubmenuOpen(true);
  const handleMouseLeave = () => setSubmenuOpen(false);

  return (
    <div
      className={`relative ${
        item.label === "Faqs" ? "xl:block lg:hidden block" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* MAIN MENU LINK */}
      <Link
        href={item.href}
        className={`
          px-5 py-2 text-base flex items-center font-normal transition-all duration-300
          rounded-full select-none
          ${
            isActive
              ? "bg-[#470000B3] text-white"
              : "text-white dark:text-white"
          }
          hover:bg-[#470000B3] hover:text-white
        `}
      >
        {item.label}

        {/* Dropdown arrow */}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.3em"
            height="1.3em"
            viewBox="0 0 24 24"
            className="ml-1"
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
      {submenuOpen && (
        <div className="absolute py-2 top-10 left-0 mt-0.5 w-60 bg-white dark:bg-darkmode shadow-lg dark:shadow-darkmd rounded-2xl z-50">
          {item.submenu?.map((subItem, index) => {
            const isSubActive = cleanPath === subItem.href.replace(/\/$/, "");

            return (
              <Link
                key={index}
                href={subItem.href}
                className={`
                  block px-4 py-2 rounded-md transition
                  ${
                    isSubActive
                      ? "bg-[#470000B3] text-white"
                      : "text-black dark:text-white hover:bg-[#470000B3] hover:text-white"
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

export default HeaderLink;
