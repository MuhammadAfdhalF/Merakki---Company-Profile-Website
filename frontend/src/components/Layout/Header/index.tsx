"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import { headerData } from "../Header/Navigation/menuData";

import Signin from "@/components/Auth/SignIn";
import { SuccessfullLogin } from "@/components/Auth/AuthDialog/SuccessfulLogin";
import { FailedLogin } from "@/components/Auth/AuthDialog/FailedLogin";
import { UserRegistered } from "@/components/Auth/AuthDialog/UserRegistered";
import AuthDialogContext from "@/app/context/AuthDialogContext";
import { getImgPath } from "@/utils/imagePath";

const Header: React.FC = () => {
  const pathname = usePathname();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);

  const authDialog = useContext(AuthDialogContext);

  /* ================= SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        signInRef.current &&
        !signInRef.current.contains(e.target as Node)
      ) {
        setIsSignInOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    if (isSignInOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, navbarOpen]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`sticky top-0 z-50 w-full transition-all ${sticky ? "bg-black/70 shadow-lg" : "bg-black/50"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between p-6">
          {/* LOGO */}
          <Link href="/">
            <Image
              src={getImgPath("/images/logo/logo_navbar.png")}
              alt="logo"
              width={160}
              height={40}
              style={{ height: "30px", width: "auto" }}
            />
          </Link>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setNavbarOpen(true)}
            className="lg:hidden text-white"
            aria-label="Open menu"
          >
            <Icon icon="mdi:menu" className="text-3xl" />
          </button>


          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            <ul className="flex items-center gap-6">
              {headerData.map((item, index) => (
                <HeaderLink key={index} item={item} />
              ))}
            </ul>

            {/* LOGIN ICON */}
            <button
              onClick={() => setIsSignInOpen(true)}
              className="p-2 rounded-full text-white hover:bg-[#470000B3] transition"
              aria-label="Open Sign In Modal"
            >
              <Icon icon="mdi:login" className="text-2xl" />
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-64
    bg-black/70
    backdrop-blur-sm
    z-40 transform transition-transform duration-300
    ${navbarOpen ? "translate-x-0" : "translate-x-full"}
  `}
        >



          <div className="flex items-center justify-between p-4">
            <h2 className="font-bold">Menu</h2>
            <button onClick={() => setNavbarOpen(false)}>✕</button>
          </div>

          <nav className="flex flex-col p-4 gap-4">
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} onClick={() => setNavbarOpen(false)}
              />
            ))}

            <button
              onClick={() => {
                setIsSignInOpen(true);
                setNavbarOpen(false);
              }}
              className="border border-white text-white py-2 rounded-lg"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* ================= SIGN IN MODAL ================= */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            ref={signInRef}
            className="
              relative
              w-full
              max-w-[480px]
              min-h-[640px]
              flex
              items-center
              justify-center
            "
          >
            {/* CLOSE */}
            <button
              onClick={() => setIsSignInOpen(false)}
              className="absolute -top-12 right-0 text-white hover:opacity-80"
              aria-label="Close"
            >
              <Icon icon="ic:round-close" className="text-3xl" />
            </button>

            {/* MODAL CONTENT */}
            <Signin signInOpen={(val: boolean) => setIsSignInOpen(val)} />
          </div>
        </div>
      )}

      {/* ================= ALERTS ================= */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] ${authDialog?.isSuccessDialogOpen ? "block" : "hidden"
          }`}
      >
        <SuccessfullLogin />
      </div>

      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] ${authDialog?.isFailedDialogOpen ? "block" : "hidden"
          }`}
      >
        <FailedLogin />
      </div>

      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] ${authDialog?.isUserRegistered ? "block" : "hidden"
          }`}
      >
        <UserRegistered />
      </div>
    </>
  );
};

export default Header;
