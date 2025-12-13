"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getImgPath } from "@/utils/imagePath";

const WHATSAPP_LINK = "https://wa.me/6288271962472";
const INSTAGRAM_LINK =
  "https://www.instagram.com/merakicreatif?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const EMAIL_LINK = "mailto:meraki@gmail.com";

const WorkGrow = () => {
  return (
    <section
      className="py-10 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #170000 100%)",
      }}
    >
      <div className="container relative z-10">

        {/* ================= HEADER ================= */}
        <div
          className="max-w-2xl mb-10"
          data-aos="fade-right"
          data-aos-delay="150"
          data-aos-duration="1000"
        >
          <h2 className="text-white text-[32px] font-bold leading-snug mb-3">
            Contact Us
          </h2>

          <p className="text-white/80 text-[16px] leading-relaxed">
            Let’s collaborate and create something meaningful
          </p>

          <p className="text-white/50 text-[13px] mt-2">
            Available for new projects • We usually reply within 24 hours
          </p>
        </div>

        <div
          className="w-24 h-[1px] bg-white/20 mb-10"
          data-aos="fade-right"
          data-aos-delay="250"
          data-aos-duration="800"
        />


        {/* ================= CONTACT CARD ================= */}
        <div
          className="
          bg-[#400000]
          rounded-[28px]
          px-10 py-10
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between
          gap-10
          shadow-2xl

          max-w-5xl
          mx-auto
        "
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="900"
        >

          {/* WHATSAPP */}
          <Link
            href={WHATSAPP_LINK}
            target="_blank"
            className="
              flex items-center gap-4
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:opacity-90
            "
          >
            <Image
              src={getImgPath("/images/footer/icon-wa.png")}
              alt="WhatsApp"
              width={42}
              height={42}
            />
            <div>
              <p className="text-white text-[16px] font-semibold">
                Whatsapp
              </p>
              <p className="text-white/70 text-[14px]">
                088271962472
              </p>
            </div>
          </Link>

          {/* INSTAGRAM */}
          <Link
            href={INSTAGRAM_LINK}
            target="_blank"
            className="
              flex items-center gap-4
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:opacity-90
            "
          >
            <Image
              src={getImgPath("/images/footer/icon-instagram.png")}
              alt="Instagram"
              width={42}
              height={42}
            />
            <div>
              <p className="text-white text-[16px] font-semibold">
                Instagram
              </p>
              <p className="text-white/70 text-[14px]">
                @merakicreatif
              </p>
            </div>
          </Link>

          {/* EMAIL */}
          <Link
            href={EMAIL_LINK}
            className="
              flex items-center gap-4
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:opacity-90
            "
          >
            <Image
              src={getImgPath("/images/footer/icon-gmail.png")}
              alt="Email"
              width={42}
              height={42}
            />
            <div>
              <p className="text-white text-[16px] font-semibold">
                Gmail
              </p>
              <p className="text-white/70 text-[14px]">
                meraki@gmail.com
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkGrow;
