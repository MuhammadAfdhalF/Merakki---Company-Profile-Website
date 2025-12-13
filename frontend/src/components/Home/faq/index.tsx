"use client";
import { useState } from "react";
import { accordionData } from "../../../app/api/data";
import Link from "next/link";

const FaqQuestion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
            {accordionData.map((item, index) => (
              <div
                key={index}
                className="bg-[#400000]"
              >
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
                  <span className="text-white">
                    {item.title}
                  </span>

                  <span className="opacity-90">
                    {activeIndex === index ? "–" : "+"}
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    bg-[#400000]
                    ${activeIndex === index
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
              <p className="text-white text-base pb-2">
                Still have questions?
              </p>
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
