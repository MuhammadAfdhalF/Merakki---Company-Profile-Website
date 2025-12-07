"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  "/images/hero/home.jpg",
  "/images/hero/home_2.jpg",
  "/images/hero/home_3.jpg",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src={slides[current]}
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* TEXT CONTENT (naik) */}
      <div className="absolute inset-0 flex flex-col justify-start items-center text-center px-6 z-30 pt-[110px]">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
          CREATIVE <br /> MAGIC <br /> HERE
        </h1>

        <p className="text-white/80 mt-4 text-lg md:text-xl">
          Turning your brand from “meh” to “wow.”
        </p>
      </div>

      {/* DOTS (naik juga) */}
      <div className="absolute bottom-32 w-full flex justify-center z-40">
        <div className="flex gap-5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${current === index ? "bg-[#840303]" : "bg-[#C9C9C9] opacity-70"}
              `}
            />
          ))}
        </div>
      </div>

      {/* CURVE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-[20]">
        <svg
          className="block w-full h-[70px] md:h-[70px]"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0,200 
              C0,50 1200,50 1200,200 
              L1200,200 
              L0,200 
              Z
            "
            fill="#400000"
          />
        </svg>
      </div>
    </section>
  );
}
