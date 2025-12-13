"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

interface HeroSubProps {
  title: string;
  description: string;
}

const images = [
  "/images/hero/home.jpg",
  "/images/hero/home_2.jpg",
  "/images/hero/home_3.jpg",
];

const HeroSub: FC<HeroSubProps> = ({ title, description }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5500); // slide pelan & elegan

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[65vh] overflow-hidden">
      {/* ================= BACKGROUND IMAGE SLIDER ================= */}
      {images.map((img, index) => (
        <Image
          key={img}
          src={img}
          alt="Hero background"
          fill
          priority={index === 0}
          className={`
            object-cover transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* ================= BLACK GRADIENT OVERLAY (LEFT ONLY) ================= */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-black/85
          via-black/60
          to-transparent
        "
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {title}
            </h1>

            <p className="text-base md:text-lg text-white/80">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSub;
