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
  const [animKey, setAnimKey] = useState(0); // re-trigger anim tiap slide

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [current]);

  return (
    <section className="relative w-full h-[90vh] min-h-[520px] overflow-hidden">
      {/* Background crossfade */}
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Hero Background"
          fill
          priority={i === 0}
          className={`
            absolute inset-0 object-cover
            transition-opacity duration-1000 ease-in-out
            ${i === current ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* TEXT CONTENT */}
      <div
        key={animKey}
        className="absolute inset-0 flex flex-col justify-start items-center text-center px-6 z-30 pt-[110px]"
      >
        {/* H1 stagger per line */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
          <span className="hero-line hero-line-1 block">CREATIVE</span>
          <span className="hero-line hero-line-2 block">MAGIC</span>
          <span className="hero-line hero-line-3 block">HERE</span>
        </h1>

        {/* P muncul setelah H1 */}
        <p className="hero-sub text-white/80 mt-4 text-lg md:text-xl">
          Turning your brand from “meh” to “wow.”
        </p>
      </div>

      {/* DOTS */}
      <div
        key={`dots-${animKey}`}
        className="absolute bottom-32 w-full flex justify-center z-40 hero-dots-wrap"
      >
        <div className="flex gap-5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                hero-dot
                w-3 h-3 rounded-full transition-all
                ${current === index ? "bg-[#840303]" : "bg-[#C9C9C9] opacity-70"}
              `}
              style={{ animationDelay: `${index * 120}ms` }} // pop satu-satu
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
            d="M0,200 C0,50 1200,50 1200,200 L1200,200 L0,200 Z"
            fill="#400000"
          />
        </svg>
      </div>

      {/* Animations */}
      <style jsx>{`
        /* Lines stagger */
        .hero-line {
          opacity: 0;
          transform: translateY(14px);
          animation: lineFadeUp 0.9s ease-out forwards;
        }
        .hero-line-1 { animation-delay: 0ms; }
        .hero-line-2 { animation-delay: 180ms; }
        .hero-line-3 { animation-delay: 360ms; }

        @keyframes lineFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Subtitle after lines */
        .hero-sub {
          opacity: 0;
          transform: translateY(10px);
          animation: subFadeUp 0.8s ease-out forwards;
          animation-delay: 620ms;
        }

        @keyframes subFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Dots container fade in later */
        .hero-dots-wrap {
          opacity: 0;
          transform: translateY(8px);
          animation: dotsWrapFade 0.6s ease-out forwards;
          animation-delay: 900ms;
        }

        @keyframes dotsWrapFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Each dot pop one by one */
        .hero-dot {
          opacity: 0;
          transform: scale(0.6);
          animation: dotPop 0.45s ease-out forwards;
          animation-delay: 1000ms; /* base delay, ditambah inline delay */
        }

        @keyframes dotPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
