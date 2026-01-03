"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function norm(p: string) {
  if (!p) return "/";
  // rapihin // jadi /
  p = p.replace(/\/{2,}/g, "/");
  return p;
}

export default function AdminNavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathnameRaw = usePathname();

  const pathname = norm(pathnameRaw || "/");
  const target = norm(href);

  const isDashboard =
    target === "/admin" || target === "/admin/";

  const isActive = isDashboard
    ? pathname === "/admin" || pathname === "/admin/" // ✅ exact only
    : pathname === target ||
      pathname.startsWith(target.endsWith("/") ? target : target + "/");

  return (
    <Link
      href={href}
      className={[
        "block px-4 py-3 rounded-xl text-sm transition",
        isActive ? "bg-[#470000] text-white" : "text-white/80 hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
