import HeroSub from '@/components/SharedComponent/HeroSub'
import React from 'react'
import { Metadata } from "next";
import Counter from '@/components/Home/Counter';
import WorkGrow from '@/components/Home/WhoIs';
import BuildAmazing from '@/components/Home/Branding';
export const metadata: Metadata = {
  title: "About | Meraki.",
  icons: {
    icon: "/images/logo/logo-web.png",
  },
};


const page = () => {
  return (
    <>
        <HeroSub
            title="About Us"
            description="Get to know us better"
        />
        {/* <Counter/> */}
        <WorkGrow/>
        {/* <BuildAmazing isSpace={false} /> */}
    </>
  )
}

export default page