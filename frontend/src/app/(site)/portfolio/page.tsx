import CardBox from "@/components/Home/Portofolio/index";
import HeroSub from "@/components/SharedComponent/HeroSub";
import AddOns from "@/components/Home/add-ons";

import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Portfolio | Sustainable",
};

const page = () => {
  return (
    <>
      <HeroSub title="Portfolio" description="Visual stories crafted to help brands stand out and connect.
" 
      />
      <AddOns />
      <CardBox />
    </>
  );
};

export default page;
