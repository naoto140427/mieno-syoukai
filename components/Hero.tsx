"use client";

import { m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import ClientMotionWrapper from "@/components/ClientMotionWrapper";

export default function Hero() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <ClientMotionWrapper>
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black text-center text-white">
        {/* Fallback Background Image (Visible until Spline loads) */}
        <div
          className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-1000 ease-in-out ${isSplineLoaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <Image
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
            alt="Dark motorcycle background"
            fill
            className="object-cover"
            priority
          />
          {/* オーバーレイ (画像用) */}
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        {/* Spline 3D Scene (Embedded via Iframe for Event Isolation) */}
        <div className={`absolute inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${isSplineLoaded ? 'opacity-100' : 'opacity-0'}`}>
           <iframe loading="lazy"
              src="/spline-bg.html"
              className="w-full h-full border-0 pointer-events-none"
              title="Spline Background"
              onLoad={() => setIsSplineLoaded(true)}
           />
           {/* Overlay for text readability over 3D model (Always visible on top of Spline) */}
           <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        </div>

        {/* アニメーションコンテナ */}
        <m.div
          className="relative z-20 w-full flex-grow flex flex-col items-center justify-center px-6 lg:px-8 py-20 pointer-events-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-grow flex flex-col items-center justify-center pointer-events-auto">
              <m.h1
              className="text-5xl font-bold tracking-tighter sm:text-7xl mb-6 drop-shadow-2xl"
              variants={itemVariants}
              >
              変革の風を、二輪で切り裂く。
              </m.h1>

              <m.p
              className="text-xl text-gray-200 sm:text-2xl max-w-3xl mb-16 drop-shadow-lg"
              variants={itemVariants}
              >
              株式会社三重野商会は、路面と対話し、未踏の地に足跡（タイヤ痕）を残す。
              </m.p>
          </div>

          {/* CTA (画面下部) */}
          <m.div
            className="mt-auto pb-12 z-20 pointer-events-auto"
            variants={itemVariants}
          >
            <Link href="/units" className="flex flex-col items-center gap-2 cursor-pointer group">
              <span className="text-sm font-medium text-gray-300 tracking-wide group-hover:text-white transition-colors">
                さらに詳しく
              </span>
              <m.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-8 w-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              </m.div>
            </Link>
          </m.div>
        </m.div>
      </section>
    </ClientMotionWrapper>
  );
}
