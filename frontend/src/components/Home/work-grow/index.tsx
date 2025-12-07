import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getImgPath } from "@/utils/imagePath";

const WorkGrow = () => {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #170000 100%)",
      }}
    >
      {/* FULL DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="container mx-auto grid md:grid-cols-2 gap-14 items-center relative z-10">
        {/* LEFT TEXT (AOS LIKE HERO) */}
        <div
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <h2 className="text-white text-4xl font-semibold leading-snug">
            What’s Meraki. ?
          </h2>

          <p className="text-gray-300 leading-relaxed mt-6 max-w-lg">
            Meraki is a creative agency built on big ideas, positive energy, and
            a passion for making brands look exceptional. We operate in Jakarta,
            Pekanbaru, and Dumai—ready to support clients from anywhere.
          </p>

          <p className="text-gray-300 leading-relaxed mt-4 max-w-lg">
            More than 50 businesses have trusted us with their visual identity
            and design needs. We combine creativity with strategy to ensure
            every result not only looks great but also works effectively for
            your business.
          </p>

          {/* LOCATION + ICON */}
          <div className="flex items-center gap-3 mt-8 text-gray-300 text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 384 512"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 
              86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.3 15.3 47.4 0zM192 
              272c-44.1 0-80-35.9-80-80s35.9-80 80-80s80 35.9 80 80s-35.9 80-80 
              80z"
              />
            </svg>
            Jakarta – Pekanbaru – Dumai
          </div>
        </div>

        {/* RIGHT IMAGE (AOS LIKE HERO) */}
        <div
          className="flex justify-center md:justify-start md:ml-20"
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <Image
            src={getImgPath("/images/work-grow/logo_meraki.png")}
            alt="Meraki Logo"
            className="rounded-xl shadow-xl"
            width={380}
            height={200}
          />
        </div>
      </div>
    </section>
  );
};

export default WorkGrow;
