import React from "react";
import Link from "next/link";

const whyChooseData = [
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

const BuildAmazing = ({ isSpace }: { isSpace: boolean }) => {
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

          {/* RIGHT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {whyChooseData.map((item, index) => (
              <div
                key={index}
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
      </div>
    </section>
  );
};

export default BuildAmazing;
