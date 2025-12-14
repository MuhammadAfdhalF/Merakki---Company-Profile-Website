"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroSub from "@/components/SharedComponent/HeroSub";

/* ================= TABS ================= */
const tabs = ["All", "Design", "Photography", "Video", "Branding"];

/* ================= DATA ================= */
const portfolioData = [
  {
    type: "image",
    src: "/images/hero/home.jpg",
    title: "Brand Identity Concept",
    category: "Design",
  },
  {
    type: "image",
    src: "/images/hero/home_2.jpg",
    title: "Product Photography",
    category: "Photography",
  },
  {
    type: "video",
    src: "/images/portofolio/vidio-porto.mp4",
    title: "Brand Campaign Video",
    category: "Video",
  },
  {
    type: "image",
    src: "/images/hero/home_3.jpg",
    title: "Social Media Visual",
    category: "Branding",
  },
  {
    type: "video",
    src: "/images/portofolio/vidio-porto.mp4",
    title: "Reels Marketing Video",
    category: "Video",
  },
  {
    type: "image",
    src: "/images/hero/home.jpg",
    title: "Creative Direction",
    category: "Design",
  },
];

export default function PortfolioContent() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeItem, setActiveItem] = useState<any>(null);

  /* ESC CLOSE */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const filteredData =
    activeTab === "All"
      ? portfolioData
      : portfolioData.filter((item) => item.category === activeTab);

  return (
    <>
      {/* HERO */}
      <HeroSub
        title="Portfolio Details"
        description="A closer look at the ideas, process, and visual direction behind each project."
      />

      {/* MAIN SECTION */}
      <section
        className="pt-20 pb-28"
        style={{
          background: "linear-gradient(180deg, #0D0D0D 0%, #170000 100%)",
        }}
      >
        <div className="container">

          {/* ================= TABS ================= */}
          <div className="flex flex-wrap gap-8 mb-14">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  text-sm md:text-base font-medium
                  transition-all duration-300
                  ${activeTab === tab
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-white/50 hover:text-white"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ================= GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="800"
                onClick={() => setActiveItem(item)}
                className="
                  relative aspect-[4/5]
                  overflow-hidden rounded-2xl
                  cursor-pointer group
                "
              >
                {/* IMAGE / VIDEO */}
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />
                )}

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-black/40
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                    flex flex-col items-center justify-center gap-3
                    text-center px-4
                  "
                >
                  {/* EYE ICON */}
                  <div
                    className="
                      w-14 h-14 rounded-full
                      bg-[#f1e6d8]/90
                      flex items-center justify-center
                      shadow-md
                    "
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#1a1a1a]"
                    >
                      <path d="M12 5C5.636 5 1 12 1 12s4.636 7 11 7 11-7 11-7-4.636-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  </div>

                  <p className="text-white text-sm font-medium">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {activeItem && (
        <div
          className="
            fixed inset-0 z-[9999]
            bg-black/70 backdrop-blur-sm
            flex items-center justify-center px-4
            animate-fade-in
          "
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-5xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {activeItem.type === "image" ? (
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                width={1400}
                height={900}
                className="w-full h-auto rounded-xl"
              />
            ) : (
              <video
                src={activeItem.src}
                controls
                autoPlay
                className="w-full rounded-xl"
              />
            )}

            <p className="text-white text-center mt-4 text-sm">
              {activeItem.title}
            </p>

            <button
              onClick={() => setActiveItem(null)}
              className="
                absolute -top-4 -right-4
                w-10 h-10
                bg-white text-black
                rounded-full font-bold
                flex items-center justify-center
                shadow-lg hover:scale-105 transition
              "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
