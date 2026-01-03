import Header from "@/components/Layout/Header";
import FooterXGate from "@/components/Layout/FooterXGate";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import NextTopLoader from "nextjs-toploader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Aoscompo>
      <Header />
      <NextTopLoader color="#400000" />
      <FloatingContact />

      {children}

      <FooterXGate />
      <ScrollToTop />
    </Aoscompo>
  );
}
