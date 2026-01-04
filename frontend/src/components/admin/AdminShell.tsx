"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

import ProfileMenu from "@/components/admin/ProfileMenu";

// Icons (lucide)
import {
  LayoutDashboard,
  Briefcase,
  Home,
  Sparkles,
  Users,
  HelpCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export default function AdminShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/admin/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/portfolios", label: "Portfolios", icon: Briefcase },
    { href: "/admin/home-sections", label: "Home Sections", icon: Home },
    { href: "/admin/why-chooses", label: "Why Chooses", icon: Sparkles },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/") return pathname === "/admin/";
    return pathname?.startsWith(href);
  };

  return (
    <div
      className="min-h-screen text-white flex"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #170000 100%)",
      }}
    >
      {/* SIDEBAR */}
      <aside className="hidden md:block w-[270px] border-r border-white/10 bg-black/25 backdrop-blur">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              <span className="text-sm font-semibold">M</span>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-wide">Meraki.</div>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-6 space-y-2">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition",
                  "border border-transparent",
                  active
                    ? "bg-[#470000]/60 border-white/10 shadow-[0_10px_30px_rgba(71,0,0,0.25)]"
                    : "text-white/80 hover:bg-white/5 hover:border-white/10",
                ].join(" ")}
              >
                {/* Active indicator */}
                <span
                  className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full transition",
                    active ? "bg-white/70" : "bg-transparent",
                  ].join(" ")}
                />

                <span
                  className={[
                    "h-9 w-9 rounded-xl flex items-center justify-center transition",
                    active
                      ? "bg-white/10"
                      : "bg-white/5 group-hover:bg-white/10",
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <span className={active ? "text-white" : ""}>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 border-t border-white/10 mt-6">
            <Link
              href={`${basePath}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full gap-2 px-4 py-3 rounded-2xl text-sm text-white/80 hover:text-white transition bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-[18px] w-[18px]" />
                Back to Landing
              </span>
              <ExternalLink className="h-[16px] w-[16px] opacity-70" />
            </Link>
          </div>
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <div className="text-sm text-white/70">Creative Agency</div>

          <div className="flex items-center gap-3">
            <ProfileMenu />
          </div>
        </header>

        {/* PAGE */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
