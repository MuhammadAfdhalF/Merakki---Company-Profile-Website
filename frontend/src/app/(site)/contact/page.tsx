
import Contact from "@/components/Home/Contact";

import Faq from "@/components/Home/Faq";

import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact | Meraki.",
  icons: {
    icon: "/images/logo/logo-web.png",
  },
};
const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
  ];
  return (
    <>
      <HeroSub
        title="Contact & Faq"
        description="Reach out to us and find quick answers to your questions.
"
      />
      <Contact />
      <Faq />
    </>
  );
};

export default page;
