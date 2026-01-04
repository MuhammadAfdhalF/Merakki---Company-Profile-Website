"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { fetchPublicHome } from "@/lib/publicApi";

type WhyChooseItem = {
  id?: number;
  title: string;
  description: string;
  order?: number;
  is_active?: boolean | number;
};

const whyChooseDataFallback: WhyChooseItem[] = [
  {
    title: "Strategic Brand Design",
    description:
      "We craft visual identities that don’t just look good — they position your brand clearly and make you stand out.",
  },
  {
    title: "Creative + Business Thinking",
    description:
      "Every design comes with purpose — built to connect with your audience and support real growth.",
  },
  {
    title: "Trusted by 50+ Brands",
    description:
      "More than 50 businesses across industries have trusted Meraki to elevate their brand.",
  },
  {
    title: "Full-Service Creative Partner",
    description:
      "From logo, social media, packaging, to brand guidelines — we handle it all in one place.",
  },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const BuildAmazing = ({ isSpace }: { isSpace: boolean }) => {
  const [whyChooseData, setWhyChooseData] = useState<WhyChooseItem[]>(
    whyChooseDataFallback
  );

  // Slider state (page)
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(0);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const home = await fetchPublicHome();
        const items: WhyChooseItem[] = Array.isArray((home as any)?.why_chooses)
          ? (home as any).why_chooses
          : [];

        if (!alive) return;

        if (items.length > 0) {
          const sorted = [...items].sort(
            (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
          );
          setWhyChooseData(sorted);
          setPage(0); // reset ke page awal kalau data berubah
        }
      } catch {
        // fallback tetap dipakai
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // pages = [[item1..item4], [item5..item8], ...]
  const pages = useMemo(
    () => chunk(whyChooseData, ITEMS_PER_PAGE),
    [whyChooseData]
  );

  const totalPages = pages.length;

  // clamp page kalau total pages mengecil
  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const canSlide = totalPages > 1;

  function goTo(p: number) {
    setPage(Math.min(Math.max(0, p), totalPages - 1));
  }

  function next() {
    goTo(page + 1);
  }
  function prev() {
    goTo(page - 1);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX == null) return;

    const endX = e.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;

    // threshold swipe
    if (Math.abs(delta) < 40) return;

    if (delta < 0) {
      // swipe left -> next page
      if (canSlide) next();
    } else {
      // swipe right -> prev page
      if (canSlide) prev();
    }
  }

  return (
    <section className="relative bg-[#400000] py-20">
      <div className="relative container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT TEXT */}
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <h2 className="text-white text-[32px] font-bold leading-snug pb-4">
              Why Choose Our Digital <br /> Agency?
            </h2>

            <p className="text-white/80 text-[14px] leading-relaxed max-w-md">
              Meraki is a creative agency built from big ideas, positive energy,
              and a real passion for making brands look and feel cooler. With
              teams in Jakarta, Pekanbaru, and Dumai, we’re ready to support
              clients from anywhere.
            </p>

            <br />

            <p className="text-white/80 text-[14px] leading-relaxed max-w-md">
              More than 50 businesses have trusted us with their visual identity
              and design needs. We blend creativity with strategy, so what we
              create isn’t just beautiful — it’s built to work, grow, and
              strengthen your business.
            </p>
          </div>

          {/* RIGHT CARDS (PAGED SLIDER) */}
          <div>
            {/* Slider viewport */}
            <div
              className="relative overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Track */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${page * 100}%)`,
                }}
              >
                {pages.map((pageItems, pageIndex) => (
                  <div key={pageIndex} className="w-full shrink-0">
                    {/* ✅ grid kamu tetap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {pageItems.map((item, index) => (
                        <div
                          key={(item as any)?.id ?? `${pageIndex}-${index}`}
                          data-aos="fade-up"
                          data-aos-delay={`${(index + 1) * 150}`}
                          data-aos-duration="900"
                        >
                          <div
                            className="
                              bg-[#5a0000] p-5 rounded-2xl shadow-md relative
                              transition-all duration-300 ease-out
                              hover:bg-[#470000]
                              hover:-translate-y-2 hover:scale-[1.02]
                              hover:shadow-2xl
                            "
                          >
                            {/* TITLE */}
                            <h6 className="text-white text-[15px] font-semibold leading-snug">
                              {item.title}
                            </h6>

                            {/* DESCRIPTION */}
                            <p className="text-white/70 text-[12px] leading-snug pt-2 pb-6">
                              {item.description}
                            </p>

                            {/* WHITE ARROW ICON */}
                            <Link href="#" className="absolute bottom-3 right-3">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-80 hover:opacity-100 transition"
                              >
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOTS (muncul kalau > 1 page) */}
            {canSlide && (
              <div className="mt-6 flex justify-center gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      i === page ? "bg-white" : "bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildAmazing;
