import React from "react";
import { getImgPath } from "@/utils/imagePath";

const WorkGrow = () => {
  return (
    <section
      className="relative py-28 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${getImgPath("/images/hero/home_2.jpg")})`,
      }}
    >
      {/* FULL DARK OVERLAY (TIDAK MENUTUP KONTEN) */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto text-center max-w-4xl text-white">
        {/* TITLE */}
        <h2
          className="text-4xl md:text-5xl font-semibold"
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-duration="1000"
        >
          Creative Solutions for Ambitious Brands
        </h2>

        {/* PARAGRAPH 1 */}
        <p
          className="mt-8 text-gray-300 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="1000"
        >
          We craft strategic designs that elevate your identity, strengthen your
          presence, and drive real results.
        </p>

        {/* PARAGRAPH 2 */}
        <p
          className="mt-2 text-gray-300 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="450"
          data-aos-duration="1000"
        >
          Through a thoughtful blend of creativity, research, and purposeful
          storytelling, we help brands communicate their value with clarity and
          confidence.
        </p>

        {/* PARAGRAPH 3 */}
        <p
          className="mt-2 text-gray-300 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-duration="1000"
        >
          Every project is approached with a deep understanding of your goals,
          ensuring each visual choice supports growth, enhances engagement, and
          builds long-term brand recognition.
        </p>

        {/* PARAGRAPH 4 */}
        <p
          className="mt-2 text-gray-300 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="750"
          data-aos-duration="1000"
        >
          At Meraki, we don’t just design — we create meaningful experiences
          that move your audience and amplify your impact.
        </p>
      </div>
    </section>
  );
};

export default WorkGrow;
