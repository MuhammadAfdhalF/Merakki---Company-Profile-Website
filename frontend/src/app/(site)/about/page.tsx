import HeroSub from '@/components/SharedComponent/HeroSub'
import React from 'react'
import { Metadata } from "next";
import Counter from '@/components/Home/Counter';
import WorkGrow from '@/components/Home/WhoIs';
import BuildAmazing from '@/components/Home/Branding';
export const metadata: Metadata = {
    title: "About | Sustainable",
};

const page = () => {
  return (
    <>
        <HeroSub
            title="About Us"
            description=""
            curveFill="#0a0909" 
        />
        {/* <Counter/> */}
        <WorkGrow/>
        <BuildAmazing isSpace={false} />
    </>
  )
}

export default page