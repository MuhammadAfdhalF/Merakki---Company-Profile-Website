"use client";
import { getImgPath } from "@/utils/imagePath";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const WHATSAPP_LINK = "http://wa.me/6288271962472";
const INSTAGRAM_LINK =
  "https://www.instagram.com/merakicreatif?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const GMAIL_LINK = "mailto:meraki@gmail.com"; // ganti kalau emailnya beda
const ACUYYY_LINK =
  "https://www.linkedin.com/in/muhammad-afdhal-f-3b3317217/?originalSubdomain=id";

const Footer: FC = () => {
  const pathname = usePathname();
  const bgImagePath = getImgPath("/images/footer/melengkung_cuy.png");

  return (
    <footer
      className={`bg-[#121212] bg-cover bg-no-repeat w-full h-full mt-20 ${
        pathname === "/" ? "pt-72 z-3" : "pt-32"
      }`}
      style={{ backgroundImage: `url(${bgImagePath})` }}
    >
      <div className="relative bg-[#400000] text-white">
        <div className="container py-10 md:py-14">
          {/* TOP AREA */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16 pb-10 border-b border-white">
            {/* LEFT: MERAKI TEXT */}
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Meraki.
              </h2>
              <p className="text-sm md:text-base text-[#f3dede] leading-relaxed mb-4">
                Meraki believes that creativity is more than visuals — it&apos;s
                an experience. We craft designs that speak, strategies that
                work, and results that create real impact.
              </p>
              <p className="text-sm md:text-base text-[#f3dede] leading-relaxed mb-6">
                Let&apos;s bring something meaningful to life, together.
              </p>

              {/* LOCATION */}
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="inline-flex items-center justify-center w-5 h-5">
                  {/* simple location icon */}
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 11.25 16.584 11.458 16.809C11.744 17.119 12.256 17.119 12.542 16.809C12.75 16.584 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z" />
                  </svg>
                </span>
                <span className="text-[#f3dede]">
                  Jakarta - Pekanbaru - Dumai
                </span>
              </div>
            </div>

            {/* RIGHT: CONTACT US */}
            <div className="w-full md:max-w-xl">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Contact Us
              </h3>
              <p className="text-sm md:text-base text-[#f3dede] leading-relaxed mb-6">
                Contact us via WhatsApp, Instagram, or email for brand
                consultations, collaborations, or just to ask a few questions.
              </p>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* WHATSAPP */}
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Image
                      src={getImgPath("/images/footer/icon-wa.png")}
                      alt="Whatsapp icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Whatsapp</span>
                    <span className="text-sm md:text-base text-[#f3dede] group-hover:underline">
                      088271962472
                    </span>
                  </div>
                </Link>

                {/* INSTAGRAM */}
                <Link
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Image
                      src={getImgPath("/images/footer/icon-instagram.png")}
                      alt="Instagram icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Instagram</span>
                    <span className="text-sm md:text-base text-[#f3dede] group-hover:underline">
                      merakicreatif
                    </span>
                  </div>
                </Link>

                {/* GMAIL */}
                <Link
                  href={GMAIL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Image
                      src={getImgPath("/images/footer/icon-gmail.png")}
                      alt="Gmail icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Gmail</span>
                    <span className="text-sm md:text-base text-[#f3dede] group-hover:underline">
                      meraki@gmail.com
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="pt-4 pb-2">
            <p className="text-center text-xs md:text-sm text-[#f3dede]">
              Meraki. @2025 <span className="mx-1">x</span> Develop by{" "}
              <Link
                href={ACUYYY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                ACuyyy.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
