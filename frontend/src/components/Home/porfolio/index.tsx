"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { getImgPath } from "@/utils/imagePath";

const WorkGrow = () => {
  const [modalImg, setModalImg] = useState<string | null>(null);

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
  ];

  return (
    <>
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0D0D0D 0%, #170000 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
            {/* LEFT TEXT */}
            <div>
              <h2 className="text-white max-w-446">OUR PORTOFOLIO</h2>

              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                Take a look at some of the brands we’ve helped grow through
                strategic design and creative execution.{" "}
              </p>
              <p className="text-gray-300 text-base font-normal py-9 max-w-408">
                <span className="font-bold">Click Our Images/PDF</span> For
                details
              </p>
            </div>

            {/* RIGHT IMAGE CARDS */}
            {portfolioData.map((item, index) => (
              <div
                key={index}
                className={index === 1 ? "xl:-mt-44 -mt-0 relative" : ""}
              >
                <div
                  className="relative rounded-14 overflow-hidden shadow-xl cursor-pointer group"
                  onClick={() => setModalImg(getImgPath(item.src))}
                >
                  {/* IMAGE */}
                  <Image
                    src={getImgPath(item.src)}
                    alt={item.alt}
                    width={0}
                    height={0}
                    layout="responsive"
                    sizes="100vh"
                    className="group-hover:scale-[1.03] transition-all duration-300"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all"></div>

                  {/* TITLE */}
                  <div className="absolute top-6 left-6">
                    <span className="text-white font-bold text-[22px] drop-shadow-lg">
                      {item.title}
                    </span>
                  </div>

                  {/* 👁 EYE ICON ON HOVER */}
                  <div
                    className="
                      absolute inset-0 
                      flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                  >
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
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
        </div>
      </section>

      {/* MODAL POPUP */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-6"
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
    </>
  );
};

export default WorkGrow;
