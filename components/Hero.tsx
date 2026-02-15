"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // メインコピー、サブコピー、CTAの時間差
        delayChildren: 0.5, // ページロード後の遅延
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
        ease: [0.16, 1, 0.3, 1] as const, // Apple風イージング
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-center text-white">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
          alt="Dark motorcycle background"
          fill
          className="object-cover"
          priority
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* アニメーションコンテナ */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl font-bold tracking-tighter sm:text-7xl mb-6"
          variants={itemVariants}
        >
          変革の風を、二輪で切り裂く。
        </motion.h1>

        <motion.p
          className="text-xl text-gray-400 sm:text-2xl max-w-3xl mb-16"
          variants={itemVariants}
        >
          株式会社三重野商会は、路面と対話し、未踏の地に足跡（タイヤ痕）を残す。
        </motion.p>

        {/* CTA (画面下部) */}
        <motion.div
          className="absolute bottom-10 z-20"
          variants={itemVariants}
        >
          <Link href="/units" className="flex flex-col items-center gap-2 cursor-pointer pb-8">
            <span className="text-sm font-medium text-gray-300 tracking-wide">
              さらに詳しく
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-8 w-8 text-white opacity-80" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
