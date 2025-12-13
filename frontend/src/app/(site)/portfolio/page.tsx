import CardBox from "@/components/Home/Portofolio/index";
import HeroSub from "@/components/SharedComponent/HeroSub";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Portfolio | Sustainable",
};

const page = () => {
  return (
    <>
      <HeroSub title="Portfolio" description="" curveFill="#161616"
      />
        <CardBox />
    </>
  );
};

export default page;
