"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionProviderComp({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null; // <- optional
}) {
  // IMPORTANT:
  // - kalau session undefined -> SessionProvider akan fetch /api/auth/session
  // - kalau session null -> dianggap "sudah tau session kosong" (bisa bikin tidak fetch)
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
