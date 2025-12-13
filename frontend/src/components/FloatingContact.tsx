"use client";

import Image from "next/image";

const WHATSAPP_LINK = "https://wa.me/6288271962472";
const INSTAGRAM_LINK =
    "https://www.instagram.com/merakicreatif?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export default function FloatingContact() {
    return (
        <div
            className="
        fixed left-3 bottom-5
        md:left-4 md:bottom-6
        z-[9999]
        flex flex-col items-center
        gap-3 md:gap-4

        animate-fade-in-up
      "
        >
            {/* WhatsApp */}
            <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="
          transition-transform duration-200 ease-out
          hover:scale-110
          active:scale-95
        "
            >
                <Image
                    src="/images/footer/icon-wa.png"
                    alt="WhatsApp"
                    width={44}
                    height={44}
                    sizes="(max-width: 768px) 36px, (max-width: 1024px) 40px, 44px"
                    className="
            object-contain
            w-9 h-9
            md:w-10 md:h-10
            lg:w-11 lg:h-11
          "
                />
            </a>

            {/* Instagram */}
            <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="
          transition-transform duration-200 ease-out
          hover:scale-110
          active:scale-95
        "
            >
                <Image
                    src="/images/footer/icon-instagram.png"
                    alt="Instagram"
                    width={44}
                    height={44}
                    sizes="(max-width: 768px) 36px, (max-width: 1024px) 40px, 44px"
                    className="
            object-contain
            w-9 h-9
            md:w-10 md:h-10
            lg:w-11 lg:h-11
          "
                />
            </a>
        </div>
    );
}
