"use client";

import { getImgPath } from "@/utils/imagePath";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const WHATSAPP_LINK = "https://wa.me/6288271962472";
const INSTAGRAM_LINK =
  "https://www.instagram.com/merakicreatif?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const EMAIL_LINK = "mailto:merakicreatif@gmail.com";
const ACUYYY_LINK =
  "https://www.linkedin.com/in/muhammad-afdhal-f-3b3317217/?originalSubdomain=id";

const Footer: FC = () => {
  const pathname = usePathname();
  const bgImagePath = getImgPath("/images/footer/melengkung_cuy.png");
  const footerBgColorMap: Record<string, string> = {
    "/": "#170000",        // Home
    "/about/": "#0f0101",   // About Us
    "/portfolio/": "#120909",
    "/portfolio/portfolio-1/": "#170000",
    "/contact/": "#0f0101",
  };

  const footerBgColor =
    footerBgColorMap[pathname] || "#161616";
  return (
    <footer
      className={`bg-cover bg-no-repeat w-full ${pathname === "/" ? "pt-72" : "pt-32"
        }`}
      style={{
        backgroundImage: `url(${bgImagePath})`,
        backgroundColor: footerBgColor,
      }}
    >

      <div className="bg-[#400000] text-white">
        <div className="container py-1 space-y-14">

          {/* ================= ROW 1 ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-10">

            {/* MERAKI */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Meraki.</h3>
              <p className="text-sm md:text-base text-[#f3dede] leading-relaxed">
                Creative agency focused on visual content — design, photography,
                and video for brands in the digital space.
              </p>
              <p className="text-sm font-medium text-[#f3dede]">
                Design • Photo • Video
              </p>
            </div>

            {/* SERVICES */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-1.5 text-sm md:text-base text-[#f3dede]">
                <li>Graphic & Social Media Design</li>
                <li>Photography (Brand & Product)</li>
                <li>Video Content & Reels</li>
                <li>Logo & Visual Identity</li>
                <li>Creative Direction</li>
              </ul>
            </div>

            {/* WHO WE WORK WITH */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Who We Work With</h4>
              <ul className="space-y-1.5 text-sm md:text-base text-[#f3dede]">
                <li>Small & Medium Businesses</li>
                <li>Startups</li>
                <li>Personal Brands</li>
                <li>Corporate Teams</li>
                <li>Growing & Local Brands</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>

              <div className="flex flex-col gap-4 text-sm md:text-base mt-2">
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  className="flex items-center gap-3 hover:underline"
                >
                  <Image
                    src={getImgPath("/images/footer/icon-wa.png")}
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                  +62 882-7196-2472
                </Link>

                <Link
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  className="flex items-center gap-3 hover:underline"
                >
                  <Image
                    src={getImgPath("/images/footer/icon-instagram.png")}
                    alt="Instagram"
                    width={20}
                    height={20}
                  />
                  @merakicreatif
                </Link>

                <Link
                  href={EMAIL_LINK}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Image
                    src={getImgPath("/images/footer/icon-gmail.png")}
                    alt="Email"
                    width={20}
                    height={20}
                  />
                  merakicreatif@gmail.com
                </Link>
              </div>
            </div>
          </div>

          {/* ================= ROW 2 ================= */}
          <div className="pt-10">
            <h4 className="text-lg font-semibold mb-4">Related Search</h4>
            <p className="text-sm md:text-base text-[#f3dede] leading-relaxed max-w-4xl">
              Creative Agency, Design Agency, Photo & Video Agency, Logo Design,
              Social Media Design, Visual Content Studio
            </p>
          </div>

          {/* ================= COPYRIGHT ================= */}
          <div className="pt-6 border-t border-white/50 mt-10 mb-10">
            <p className="text-center text-xs md:text-sm text-[#f3dede]">
              © 2025 Meraki • Built by{" "}
              <Link
                href={ACUYYY_LINK}
                target="_blank"
                className="underline hover:opacity-80"
              >
                ACuyyy
              </Link>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
