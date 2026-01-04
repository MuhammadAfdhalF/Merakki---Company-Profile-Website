"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { fetchPublicPortfolios } from "@/lib/publicApi";
import { backendFileUrl } from "@/lib/backendUrl";

/* ================= CATEGORY LABEL MAP ================= */
const CATEGORY_LABEL: Record<string, string> = {
  design: "Design",
  photography: "Photography",
  video: "Video",
  branding: "Branding",
};

type UiPortfolioItem = {
  type: "image" | "video";
  src: string; // absolute from backend OR local fallback
  title: string;
  category: string; // "Design" | "Photography" | ...
  slug?: string;
};

const fallbackData: UiPortfolioItem[] = [
  {
    type: "image",
    src: "/images/hero/home.jpg",
    title: "Brand Identity Concept",
    category: "Design",
    slug: "brand-identity-concept",
  },
  {
    type: "image",
    src: "/images/hero/home_2.jpg",
    title: "Product Photography",
    category: "Photography",
    slug: "product-photography",
  },
  {
    type: "video",
    src: "/images/portofolio/vidio-porto.mp4",
    title: "Brand Campaign Video",
    category: "Video",
    slug: "brand-campaign-video",
  },
  {
    type: "image",
    src: "/images/hero/home_3.jpg",
    title: "Social Media Visual",
    category: "Branding",
    slug: "social-media-visual",
  },
];

export default function PortfolioContent({ slug }: { slug?: string }) {
  const [activeTab, setActiveTab] = useState("All");
  const [activeItem, setActiveItem] = useState<UiPortfolioItem | null>(null);
  const [items, setItems] = useState<UiPortfolioItem[]>(fallbackData);

  /* ESC CLOSE */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* LOAD ALL PORTFOLIOS FROM API */
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await fetchPublicPortfolios("all"); // GET /public/portfolios?category=all
        if (!alive) return;

        const mapped: UiPortfolioItem[] = (Array.isArray(data) ? data : [])
          .map((p: any) => {
            const mediaArr = Array.isArray(p?.media) ? p.media : [];
            const first = mediaArr[0];

            const t = String(first?.type || "").toLowerCase();
            // Only image/video for this UI (skip pdf so layout tetap aman)
            if (t !== "image" && t !== "video") return null;

            const rawPath = String(first?.path || "");
            const absSrc = rawPath ? backendFileUrl(rawPath) : "";
            if (!absSrc) return null;

            const catValue = String(p?.category || "").toLowerCase();
            const catLabel = CATEGORY_LABEL[catValue] || catValue || "Design";

            return {
              type: t as "image" | "video",
              src: absSrc,
              title: String(p?.title || "Portfolio"),
              category: catLabel,
              slug: String(p?.slug || ""),
            } as UiPortfolioItem;
          })
          .filter(Boolean) as UiPortfolioItem[];

        if (mapped.length > 0) setItems(mapped);
      } catch {
        // fallback tetap dipakai
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  /* Tabs auto from API data (All + unique categories) */
  const tabs = useMemo(() => {
    const unique = Array.from(new Set(items.map((x) => x.category))).filter(Boolean);

    const ordered = ["Design", "Photography", "Video", "Branding"].filter((c) =>
      unique.includes(c)
    );
    const rest = unique.filter((c) => !ordered.includes(c));

    return ["All", ...ordered, ...rest];
  }, [items]);

  const filteredData =
    activeTab === "All" ? items : items.filter((item) => item.category === activeTab);

  /* If route has slug, auto open modal for that portfolio */
  useEffect(() => {
    if (!slug) return;
    const found = items.find((x) => x.slug === slug);
    if (found) setActiveItem(found);
  }, [slug, items]);

  const normalizeSrc = (src: string) => src;

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
                key={`${item.slug || "item"}-${index}`}
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
                    src={normalizeSrc(item.src)}
                    alt={item.title}
                    fill
                    className="
                      object-contain
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                    unoptimized
                  />
                ) : (
                  <video
                    src={normalizeSrc(item.src)}
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

                  <p className="text-white text-sm font-medium">{item.title}</p>
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
            bg-transparent backdrop-blur-sm
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
                src={normalizeSrc(activeItem.src)}
                alt={activeItem.title}
                width={1400}
                height={900}
                className="w-full h-[80vh] object-contain rounded-xl"
                unoptimized
              />
            ) : (
              <video
                src={normalizeSrc(activeItem.src)}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-xl"
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
