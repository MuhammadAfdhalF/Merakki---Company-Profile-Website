"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getImgPath } from "@/utils/imagePath";

import AOS from "aos";
import "aos/dist/aos.css";

const Portofolio = () => {
  const [modalItem, setModalItem] = useState<any>(null);
  const [animating, setAnimating] = useState(false);

  const portfolioData = [
    {
      type: "image",
      src: "/images/portofolio/porto-1.png",
      title: "Brand Identity Project",
      alt: "Portfolio 1",
    },
    {
      type: "video",
      src: "/images/portofolio/vidio-porto.mp4",
      title: "Brand Campaign Video",
      alt: "Portfolio Video 1",
    },
    {
      type: "image",
      src: "/images/portofolio/porto-2.png",
      title: "Creative Content Design",
      alt: "Portfolio 2",
    },
    {
      type: "video",
      src: "/images/portofolio/vidio-porto.mp4",
      title: "Reels Marketing Video",
      alt: "Portfolio Video 2",
    },
    {
      type: "image",
      src: "/images/portofolio/porto-3.png",
      title: "Digital Marketing Visuals",
      alt: "Portfolio 3",
    },
    {
      type: "image",
      src: "/images/portofolio/porto-1.png",
      title: "Brand Identity Project 2",
      alt: "Portfolio 4",
    },
  ];

  const itemsPerPage = 3;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(portfolioData.length / itemsPerPage);
  const start = page * itemsPerPage;
  const paginatedItems = portfolioData.slice(start, start + itemsPerPage);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: "ease-out",
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setAnimating(true);
    setTimeout(() => {
      setPage(newPage);
      setAnimating(false);
    }, 320);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handlePageChange((page + 1) % totalPages);
    }, 8000);
    return () => clearInterval(timer);
  }, [page, totalPages]);

  return (
    <>
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #161616 0%, #170000 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[#161616]/40"></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10">

            {/* LEFT TEXT */}
            <div data-aos="fade-up">
              <h2 className="text-white max-w-446">OUR PORTFOLIO</h2>
              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                Take a look at some of the brands we’ve helped grow through
                strategic design and creative execution.
              </p>
              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                <span className="font-bold">Click our visuals</span> for details
              </p>
            </div>

            {/* RIGHT CARDS */}
            {paginatedItems.map((item, index) => (
              <div
                key={`${page}-${item.src}-${index}`}
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 160}`}
                className={`transition-all duration-500 ease-out ${animating ? "opacity-0 translate-y-2" : "opacity-100"
                  } ${index === 1 ? "xl:-mt-44 relative" : ""}`}
              >
                <div
                  className="
                    relative rounded-14 overflow-hidden shadow-xl cursor-pointer
                    group transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:scale-[1.02]
                    hover:shadow-2xl hover:shadow-[0_20px_60px_rgba(132,3,3,0.45)]
                  "
                  onClick={() => setModalItem(item)}
                >
                  {/* IMAGE / VIDEO */}
                  {item.type === "image" ? (
                    <Image
                      src={getImgPath(item.src)}
                      alt={item.alt}
                      width={0}
                      height={0}
                      layout="responsive"
                      sizes="100vh"
                      className="group-hover:scale-[1.04] transition-all duration-500 ease-out"
                    />
                  ) : (
                    <video
                      src={getImgPath(item.src)}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-500 ease-out"
                    />
                  )}

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-[#161616]/30 group-hover:bg-[#161616]/50 transition-all duration-300"></div>

                  {/* TITLE */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white font-bold text-[22px] drop-shadow-lg">
                      {item.title}
                    </span>
                  </div>

                  {/* EYE ICON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-[#f1e6d8]/90 p-4 rounded-full shadow-md">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        className="text-[#1a1a1a]"
                      >
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DOT PAGINATION */}
          <div className="flex justify-center mt-10 gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === page ? "bg-red-900" : "bg-gray-500"
                  }`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/portfolio/portfolio-1/"
              className="text-white underline underline-offset-4 hover:opacity-80 transition"
            >
              Click to view portfolio details →
            </Link>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modalItem && (
        <div
          className="fixed inset-0 bg-[#161616]/70 backdrop-blur-sm z-[999] flex items-center justify-center p-6"
          onClick={() => setModalItem(null)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={() => setModalItem(null)}
            >
              ✕
            </button>

            {modalItem.type === "image" ? (
              <Image
                src={getImgPath(modalItem.src)}
                alt="Preview"
                width={1200}
                height={800}
                className="rounded-xl shadow-2xl"
              />
            ) : (
              <video
                src={getImgPath(modalItem.src)}
                controls
                autoPlay
                className="w-full rounded-xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Portofolio;
