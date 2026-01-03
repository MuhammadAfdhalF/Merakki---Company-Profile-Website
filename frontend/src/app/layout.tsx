import SessionProviderComp from "@/components/nextauth/SessionProvider";
import { AuthDialogProvider } from "./context/AuthDialogContext";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import { getImgPath } from "@/utils/imagePath";
import "./globals.css";

const dmsans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dropdownIcon = getImgPath("/images/contact/dropdown.svg");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        { "--dropdown-icon": `url(${dropdownIcon})` } as React.CSSProperties
      }
    >
      <body className={dmsans.className}>
        <AuthDialogProvider>
          {/* JANGAN kirim session={null} */}
          <SessionProviderComp>
            <ThemeProvider
              attribute="class"
              enableSystem={true}
              defaultTheme="system"
            >
              {children}
            </ThemeProvider>
          </SessionProviderComp>
        </AuthDialogProvider>
      </body>
    </html>
  );
}
