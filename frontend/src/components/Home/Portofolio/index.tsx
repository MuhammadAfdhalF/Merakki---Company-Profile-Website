"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getImgPath } from "@/utils/imagePath";

import AOS from "aos";
import "aos/dist/aos.css";

const Portofolio = () => {
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const portfolioData = [
    {
      src: "/images/portofolio/porto-1.png",
      title: "Brand Identity Project",
      alt: "Portfolio 1",
    },
    {
      src: "/images/portofolio/porto-2.png",
      title: "Creative Content Design",
      alt: "Portfolio 2",
    },
    {
      src: "/images/portofolio/porto-3.png",
      title: "Digital Marketing Visuals",
      alt: "Portfolio 3",
    },
    {
      src: "/images/portofolio/porto-1.png",
      title: "Brand Identity Project 2",
      alt: "Portfolio 4",
    },
    {
      src: "/images/portofolio/porto-2.png",
      title: "Creative Content Design 2",
      alt: "Portfolio 5",
    },
    {
      src: "/images/portofolio/porto-3.png",
      title: "Digital Marketing Visuals 2",
      alt: "Portfolio 6",
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
              <h2 className="text-white max-w-446">OUR PORTOFOLIO</h2>
              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                Take a look at some of the brands we’ve helped grow through
                strategic design and creative execution.
              </p>
              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                <span className="font-bold">Click Our Images/PDF</span> For
                details
              </p>
            </div>

            {/* RIGHT CARDS */}
            {paginatedItems.map((item, index) => (
              <div
                key={`${page}-${item.src}-${index}`}
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 160}`}
                data-aos-duration="900"
                style={
                  !animating ? { animationDelay: `${index * 180}ms` } : undefined
                }
                className={`transition-all duration-500 ease-out ${
                  animating
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0 portfolio-enter"
                } ${index === 1 ? "xl:-mt-44 -mt-0 relative" : ""}`}
              >
                <div
                  className="relative rounded-14 overflow-hidden shadow-xl cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[0_20px_60px_rgba(132,3,3,0.45)]"
                  onClick={() => setModalImg(getImgPath(item.src))}
                >
                  <Image
                    src={getImgPath(item.src)}
                    alt={item.alt}
                    width={0}
                    height={0}
                    layout="responsive"
                    sizes="100vh"
                    className="group-hover:scale-[1.04] transition-all duration-500 ease-out"
                  />

                  <div className="absolute inset-0 bg-[#161616]/30 group-hover:bg-[#161616]/50 transition-all duration-300"></div>

                  <div className="absolute top-6 left-6">
                    <span className="text-white font-bold text-[22px] drop-shadow-lg">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="black"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                      >
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" />
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
                className={`w-3 h-3 rounded-full transition-all ${
                  i === page ? "bg-red-900" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-[#161616]/70 backdrop-blur-sm z-[999] flex items-center justify-center p-6"
          onClick={() => setModalImg(null)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={() => setModalImg(null)}
            >
              ✕
            </button>

            <Image
              src={modalImg}
              alt="Preview Modal"
              width={1200}
              height={800}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* STAGGER ENTER ANIMATION */}
      <style jsx>{`
        .portfolio-enter {
          opacity: 0;
          transform: translateY(14px) scale(0.98);
          animation: portfolioEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes portfolioEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Portofolio;
