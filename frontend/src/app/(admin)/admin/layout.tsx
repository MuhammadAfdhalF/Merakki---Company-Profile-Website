import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin | Meraki.",
    template: "%s | Meraki.",
  },
  icons: {
    icon: "/images/logo/logo-web.png",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
