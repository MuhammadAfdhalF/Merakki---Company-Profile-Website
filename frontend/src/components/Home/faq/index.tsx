"use client";

import { useEffect, useState } from "react";
import { accordionData } from "../../../app/api/data";
import Link from "next/link";

import { fetchPublicHome } from "@/lib/publicApi";

type FaqItem = {
  id?: number;
  question: string;
  answer: string;
  order?: number;
  is_active?: boolean | number;
};

// bentuk yang dipakai UI kamu (title/content)
type UiFaqItem = {
  id?: number;
  title: string;
  content: string;
  order?: number;
};

const FaqQuestion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // fallback: tetap pakai accordionData lama
  const [faqData, setFaqData] = useState<UiFaqItem[]>(
    (accordionData || []).map((x: any, idx: number) => ({
      id: x?.id ?? idx,
      title: String(x?.title ?? ""),
      content: String(x?.content ?? ""),
      order: Number(x?.order ?? idx),
    }))
  );

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const home = await fetchPublicHome();
        const items: FaqItem[] = Array.isArray((home as any)?.faqs)
          ? ((home as any).faqs as FaqItem[])
          : [];

        if (!alive) return;

        if (items.length > 0) {
          // backend sudah orderBy('order'), tapi aman sort juga
          const sorted = [...items].sort(
            (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
          );

          const mapped: UiFaqItem[] = sorted.map((x) => ({
            id: x.id,
            title: String(x.question ?? ""),
            content: String(x.answer ?? ""),
            order: Number(x.order ?? 0),
          }));

          setFaqData(mapped);
          setActiveIndex(null); // reset buka/tutup saat data berubah
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

  return (
    <section
      className="pt-15 pb-10"
      style={{
        background: "linear-gradient(180deg, #170000 0%, #170000 100%)",
      }}
    >
      <div className="container">
        <div className="flex flex-col gap-y-8">
          <h2 className="text-white text-center">
            Frequently asked questions
          </h2>

          {/* CARD FAQ */}
          <div className="overflow-hidden relative z-10 lg:w-770 w-full m-auto bg-[#400000] rounded-2xl">
            {faqData.map((item, index) => (
              <div key={item.id ?? index} className="bg-[#400000]">
                {/* QUESTION */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="
                    w-full flex justify-between items-center
                    p-8 text-left font-bold text-xl
                    bg-[#400000]
                    text-white
                    border-none outline-none
                    focus:text-white active:text-white
                  "
                >
                  <span className="text-white">{item.title}</span>

                  <span className="opacity-90">
                    {activeIndex === index ? "–" : "+"}
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    bg-[#400000]
                    ${
                      activeIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }
                  `}
                >
                  {/* GARIS PEMBATAS → MERAH TUA */}
                  <div className="h-px bg-white mx-8" />

                  <p className="px-8 pt-4 pb-6 text-white/80 text-base font-normal">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}

            {/* FOOTER */}
            <div className="text-center bg-[#400000] py-8">
              <p className="text-white text-base pb-2">Still have questions?</p>
              <Link
                href="http://wa.me/6288271962472"
                className="text-white underline hover:text-white"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqQuestion;
