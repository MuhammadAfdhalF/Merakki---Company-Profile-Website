import React from "react";
import { Metadata } from "next";
import HeroSlider from "@/components/Home/HomeStart";
import Footer from "@/components/Layout/Footer";

import Hero from "@/components/Home/Hero";
import BuildAmazing from "@/components/Home/Branding";
import WorkGrow from "@/components/Home/WhoIs";
import AddOns from "@/components/Home/add-ons";
import Portofolio from "@/components/Home/Portofolio";
import Contact from "@/components/Home/Contact";

import Preferred from "@/components/Home/clients";
import Counter from "@/components/Home/Counter";
import FaqQuestion from "@/components/Home/Faq";
export const metadata: Metadata = {
  title: "Meraki.",
  icons: {
    icon: "/images/logo/logo-web.png",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSlider />

      {/* Background merah menyambung setelah curve */}
      <div className="bg-[#470000]">
        <BuildAmazing isSpace={true} />
        <WorkGrow />
        <AddOns />
        <Portofolio />

        <Preferred />
        {/* <Counter /> */}
        <Contact />

        <FaqQuestion />
        <Footer />

      </div>
    </main>
  );
}
