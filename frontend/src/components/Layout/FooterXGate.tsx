"use client";

import { usePathname } from "next/navigation";
import FooterX from "@/components/Layout/Footer-Tab";

export default function FooterXGate() {
    const pathname = usePathname();

    // Kalau lagi di homepage "/", jangan tampilkan FooterX
    if (pathname === "/") return null;

    // Selain itu, tampilkan FooterX
    return <FooterX />;
}
