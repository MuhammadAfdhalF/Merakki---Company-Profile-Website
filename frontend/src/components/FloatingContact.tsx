"use client";

import Image from "next/image";
import Link from "next/link";

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
        flex items-center
        gap-3
        animate-fade-in-up
      "
        >
            {/* CONTACT BUTTON */}
            <Link
                href={WHATSAPP_LINK}
                target="_blank"
                className="
    hidden md:flex
    bg-white text-black
    rounded-full
    px-6 py-3
    text-sm font-semibold
    shadow-lg
    transition-all duration-200
    hover:scale-105
    active:scale-95
  "
            >
                Contact Us
            </Link>


            {/* ICONS */}
            <div className="flex flex-col gap-3">
                <Link
                    href={WHATSAPP_LINK}
                    target="_blank"
                    className="transition-transform hover:scale-110 active:scale-95"
                >
                    <Image
                        src="/images/footer/icon-wa.png"
                        alt="WhatsApp"
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain"
                    />
                </Link>

                <Link
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    className="transition-transform hover:scale-110 active:scale-95"
                >
                    <Image
                        src="/images/footer/icon-instagram.png"
                        alt="Instagram"
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain"
                    />
                </Link>
            </div>
        </div>
    );
}
