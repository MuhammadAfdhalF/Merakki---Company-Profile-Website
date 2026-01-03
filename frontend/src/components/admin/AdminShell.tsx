"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

import ProfileMenu from "@/components/admin/ProfileMenu";

export default function AdminShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const nav = [
    { href: "/admin/", label: "Dashboard" },
    { href: "/admin/portfolios", label: "Portfolios" },
    { href: "/admin/home-sections", label: "Home Sections" },
    { href: "/admin/why-chooses", label: "Why Chooses" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/faqs", label: "FAQs" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/") return pathname === "/admin/";
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      {/* SIDEBAR */}
      <aside className="hidden md:block w-[260px] border-r border-white/10 bg-black/40">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="text-xl font-semibold">Meraki.</div>
          <p className="text-xs text-white/60 mt-1">Admin Panel</p>
        </div>

        <nav className="px-3 py-6 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block px-4 py-3 rounded-xl text-sm transition",
                isActive(item.href)
                  ? "bg-[#470000] text-white"
                  : "text-white/80 hover:bg-white/5",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-6 border-t border-white/10 mt-6">
          
            <Link
              href={`${basePath}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-white/80 hover:text-white transition"
            >
              ← Back to Landing
            </Link>
          </div>
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/10 bg-black/30 flex items-center justify-between px-4 md:px-6">
          <div className="text-sm text-white/70">Admin</div>

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
