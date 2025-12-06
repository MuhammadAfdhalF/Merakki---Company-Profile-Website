"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { headerData } from "../Header/Navigation/menuData";
import Image from "next/image";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SuccessfullLogin } from "@/components/Auth/AuthDialog/SuccessfulLogin";
import { FailedLogin } from "@/components/Auth/AuthDialog/FailedLogin";
import { UserRegistered } from "@/components/Auth/AuthDialog/UserRegistered";
import AuthDialogContext from "@/app/context/AuthDialogContext";
import { getImgPath } from "@/utils/imagePath";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  const authDialog = useContext(AuthDialogContext);

  return (
    <>
      <header
        className={`sticky h-24 top-0 py-1 z-50 w-full transition-all ${
          sticky
            ? "bg-black/70 shadow-lg" // saat scroll → hitam 70%
            : "bg-black/50" // saat belum scroll → hitam 50%
        }`}
      >
        <div className="container mx-auto flex items-center justify-between p-6 gap-6">
          <Link href="/">
            <Image
              src={getImgPath("/images/logo/logo_navbar.png")}
              alt="logo"
              width={160}
              height={50}
              style={{ width: "auto", height: "30px" }}
              quality={100}
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            {/* NAV MENU */}
            <ul className="flex items-center gap-6">
              {headerData.map((item, index) => (
                <HeaderLink key={index} item={item} />
              ))}
            </ul>

            {/* THEME + SIGN IN + SIGN UP */}
            <div className="flex items-center xl:gap-4 lg:gap-2 gap-2">
              <button
                onClick={() => setIsSignInOpen(true)}
                className="
    hidden lg:flex items-center justify-center
    p-2 rounded-full
    bg-transparent text-white
    hover:bg-white/70 hover:text-black
    transition-all duration-300
  "
                aria-label="Open Sign In Modal"
              >
                <Icon icon="mdi:login" className="text-2xl" />
              </button>

              {isSignInOpen && (
                <div
                  ref={signInRef}
                  className="fixed ml-0! top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
                >
                  <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-secondary">
                    <button
                      onClick={() => setIsSignInOpen(false)}
                      className=" hover:bg-BorderLine dark:hover:bg-border p-1 rounded-full absolute -top-5 -right-3 mr-8 mt-8"
                      aria-label="Close Sign In Modal"
                    >
                      <Icon
                        icon="ic:round-close"
                        className="text-2xl dark:text-white"
                      />
                    </button>
                    <Signin
                      signInOpen={(value: boolean) => setIsSignInOpen(value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {navbarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />
        )}

        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white dark:bg-darkmode shadow-lg transform transition-transform duration-300 max-w-64 ${
            navbarOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-black dark:text-white">
              Menu
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              aria-label="Close mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="dark:text-white"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col items-start p-4">
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className="mt-4 flex flex-col gap-4 w-full">
              <Link
                href="#"
                className="bg-white border border-primary text-primary px-4 py-2 rounded-lg hover:bg-black hover:text-white"
                onClick={() => {
                  setIsSignInOpen(true);
                  setNavbarOpen(false);
                }}
              >
                Sign In
              </Link>
              <Link
                href="#"
                className="bg-LightApricot text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
                onClick={() => {
                  setIsSignUpOpen(true);
                  setNavbarOpen(false);
                }}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
        {/* Successsful Login Alert */}
        <div
          className={`fixed top-6 end-1/2 translate-x-1/2 z-50 ${
            authDialog?.isSuccessDialogOpen == true ? "block" : "hidden"
          }`}
        >
          <SuccessfullLogin />
        </div>
        {/* Failed Login Alert */}
        <div
          className={`fixed top-6 end-1/2 translate-x-1/2 z-50 ${
            authDialog?.isFailedDialogOpen == true ? "block" : "hidden"
          }`}
        >
          <FailedLogin />
        </div>
        {/* User registration Alert */}
        <div
          className={`fixed top-6 end-1/2 translate-x-1/2 z-50 ${
            authDialog?.isUserRegistered == true ? "block" : "hidden"
          }`}
        >
          <UserRegistered />
        </div>
      </header>
    </>
  );
};

export default Header;
