import React, { FC } from "react";

interface HeroSubProps {
  title: string;
  description: string;
  curveFill?: string;
}

const HeroSub: FC<HeroSubProps> = ({ title, description, curveFill = "#161616" }) => {
  return (
    <section className="relative bg-[#400000] text-center text-white pt-20 pb-28 overflow-hidden">
      <h1 className="text-white">{title}</h1>
      <p className="text-xl text-white font-normal max-w-720 w-full mx-auto my-[1.875rem] sm:px-0 px-4">
        {description}
      </p>

      <svg
        className="absolute bottom-0 left-0 w-full h-20 md:h-28"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill={curveFill}
          d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z"
        />
      </svg>
    </section>
  );
};

export default HeroSub;
