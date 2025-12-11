import React from "react";
import { Metadata } from "next";
import HeroSlider from "@/components/Home/HeroSlider";

import Hero from "@/components/Home/Hero";
import BuildAmazing from "@/components/Home/Build-Amazing";
import WorkGrow from "@/components/Home/work-grow";
import AddOns from "@/components/Home/add-ons";
import Portofolio from "@/components/Home/porfolio";

import Preferred from "@/components/Home/preferred-plan";
import Counter from "@/components/Home/Counter";
import FaqQuestion from "@/components/Home/faq";
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
        <FaqQuestion />
      </div>
    </main>
  );
}
