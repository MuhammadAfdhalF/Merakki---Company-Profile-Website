"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { getImgPath } from "@/utils/imagePath";

import AOS from "aos";
import "aos/dist/aos.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { fetchPublicHome } from "@/lib/publicApi";
import { backendFileUrl } from "@/lib/backendUrl";

type ClientLogo = { src: string; alt: string };

const clientLogosFallback: ClientLogo[] = [
  { src: "/images/price-plan/clien-1.png", alt: "Client 1" },
  { src: "/images/price-plan/clien-2.png", alt: "Client 2" },
  { src: "/images/price-plan/clien-3.png", alt: "Client 3" },
  { src: "/images/price-plan/clien-4.png", alt: "Client 4" },
  { src: "/images/price-plan/clien-5.png", alt: "Client 5" },
];

const Preferred = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>(
    clientLogosFallback
  );

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: "ease-out",
    });

    let alive = true;

    async function load() {
      try {
        const home = await fetchPublicHome();
        const items = Array.isArray((home as any)?.clients)
          ? ((home as any).clients as any[])
          : [];

        if (!alive) return;

        if (items.length > 0) {
          // backend sudah orderBy('order'), tapi aman kita sort juga
          const sorted = [...items].sort(
            (a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0)
          );

          const mapped: ClientLogo[] = sorted
            .filter((x) => x?.logo)
            .map((x) => ({
              src: backendFileUrl(String(x.logo)),
              alt: String(x?.name || "Client"),
            }));

          if (mapped.length > 0) setClientLogos(mapped);
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

  const settings = useMemo(
    () => ({
      dots: true,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 3500,
      speed: 900,
      slidesToShow: 5,
      slidesToScroll: 1,
      pauseOnHover: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ],
    }),
    []
  );

  return (
    <section
      className="relative py-14 md:py-16 overflow-hidden"
      style={{ backgroundColor: "#400000" }}
    >
      <div className="container mx-auto relative z-10">
        {/* Title dinaikin dikit */}
        <div
          className="text-center mb-10 md:mb-12 -mt-2 md:-mt-4"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <h2 className="text-white font-bold text-3xl md:text-4xl">
            Clients Meraki.
          </h2>
        </div>

        <div className="pb-8 md:pb-10" data-aos="fade-up" data-aos-delay="250">
          <Slider {...settings}>
            {clientLogos.map((item, index) => (
              <div key={index} className="px-6">
                {/* group biar hover timbul */}
                <div className="group flex items-center justify-center h-[120px] md:h-[140px]">
                  <Image
                    src={item.src.startsWith("http") ? item.src : getImgPath(item.src)}
                    alt={item.alt}
                    width={230}
                    height={110}
                    className="
                      object-contain opacity-95 transition-all duration-300 ease-out
                      group-hover:opacity-100
                      group-hover:-translate-y-2 group-hover:scale-[1.06]
                      group-hover:drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]
                    "
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx global>{`
        .slick-dots {
          bottom: -70px !important;
        }
        .slick-dots li {
          margin: 0 3px !important;
          width: 12px !important;
        }
        .slick-dots li button {
          padding: 0 !important;
          width: 12px !important;
          height: 12px !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .slick-dots li button:before {
          font-size: 10px !important;
          color: #ffffff !important;
          opacity: 0.25 !important;
        }
        .slick-dots li.slick-active button:before {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        .slick-dots li button:focus:before,
        .slick-dots li button:active:before {
          color: #fffff !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};

export default Preferred;
