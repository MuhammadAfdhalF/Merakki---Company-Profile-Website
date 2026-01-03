"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";

function initials(name?: string, email?: string) {
  const base = (name || email || "A").trim();
  const parts = base.split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "A";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

export default function ProfileMenu() {
  const { data: session } = useSession();
  const user = (session as any)?.user;

  const [openMenu, setOpenMenu] = useState(false);
  const [openChange, setOpenChange] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const labelName = useMemo(() => user?.name || user?.email || "Admin", [user]);
  const badge = useMemo(
    () => initials(user?.name, user?.email),
    [user?.name, user?.email]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenMenu((s) => !s)}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 hover:bg-white/5 transition"
      >
        <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold">
          {badge}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white">{labelName}</div>
          <div className="text-xs text-white/50">{user?.role || "admin"}</div>
        </div>
        <div className="text-white/60 text-sm">▾</div>
      </button>

      {openMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0D0D0D] shadow-xl overflow-hidden">
          <button
            onClick={() => {
              setOpenMenu(false);
              setOpenChange(true);
            }}
            className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition"
          >
            Change Password
          </button>

          <div className="h-px bg-white/10" />

          <button
            onClick={() => signOut({ callbackUrl: "/?login=1" })}
            className="w-full text-left px-4 py-3 text-sm text-red-200 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>
      )}

      <ChangePasswordModal open={openChange} onClose={() => setOpenChange(false)} />
    </div>
  );
}
