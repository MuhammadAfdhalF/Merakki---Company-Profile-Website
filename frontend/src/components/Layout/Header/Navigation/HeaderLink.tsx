"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  // Normalize path untuk menghindari masalah trailing slash
  const cleanPath = path.replace(/\/$/, "");
  const cleanHref = item.href.replace(/\/$/, "");

  // Kondisi menu aktif:
  // - Exact match
  // - Atau jika submenu, halaman yang dimulai dengan href parent juga aktif
  let isActive = false;

  if (cleanHref === "") {
    // HOME → hanya aktif di root ("/")
    isActive = cleanPath === "";
  } else {
    // MENU BIASA → exact match atau child match
    isActive = cleanPath === cleanHref || cleanPath.startsWith(cleanHref + "/");
  }

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

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
          px-3 py-2 text-base flex items-center font-normal rounded-md transition-all duration-300
          ${isActive ? "bg-white/70 text-black" : "text-white dark:text-white"}
          hover:bg-white/70 hover:text-black
        `}
      >
        {item.label}

        {/* Dropdown arrow */}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
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
        <div className="absolute py-2 top-8 left-0 mt-0.5 w-60 bg-white dark:bg-darkmode shadow-lg dark:shadow-darkmd rounded-lg z-50">
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
                      ? "bg-white/70 text-black"
                      : "text-black dark:text-white hover:bg-AliceBlue dark:hover:bg-darklight"
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
