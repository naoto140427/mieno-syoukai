"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ClientMotionWrapper from "@/components/ClientMotionWrapper";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.4, ease: "easeOut" as const },
    },
  };

  return (
    <ClientMotionWrapper>
      <section
        ref={ref}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black"
      >
        {/* ── 背景画像（パララックス） ── */}
        <m.div className="absolute inset-0 z-0" style={{ y: imageY }}>
          <Image
            src="/hero-bg.png"
            alt="山岳路に佇むバイク"
            fill
            className="object-cover object-center scale-[1.08]"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
          {/* 左側に追加のフェード（テキスト可読性向上） */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </m.div>

        {/* ── メインコンテンツ ── */}
        <m.div
          className="relative z-10 flex-grow flex flex-col justify-center px-8 sm:px-16 lg:px-24 pt-28"
          style={{ y: textY, opacity }}
        >
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* 上部ラベル */}
            <m.div variants={fadeIn} className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-white/60" />
              <span className="text-[11px] font-bold tracking-[0.35em] text-white/60 uppercase">
                MIENO CORP. — Since 2019
              </span>
            </m.div>

            {/* メインコピー */}
            <m.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
              style={{ fontFeatureSettings: '"palt"' }}
            >
              変革の風を、
              <br />
              <span className="text-white/90">二輪で切り裂く。</span>
            </m.h1>

            {/* サブコピー */}
            <m.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/60 font-medium leading-relaxed max-w-xl mb-12"
            >
              路面と対話し、未踏の地に足跡を残す。
              <br />
              株式会社三重野商会のモビリティ哲学。
            </m.p>

            {/* CTAボタン群 */}
            <m.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/units"
                className="group inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-4 rounded-full hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-[1.02]"
              >
                機動戦力を見る
                <ArrowDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/archives"
                className="inline-flex items-center gap-2 border border-white/30 text-white text-sm font-bold px-7 py-4 rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
              >
                作戦記録を読む
              </Link>
            </m.div>
          </m.div>
        </m.div>

        {/* ── スクロールインジケーター ── */}
        <m.div
          className="relative z-10 flex flex-col items-center pb-10 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          style={{ opacity }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Scroll</span>
          <m.div
            className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent origin-top"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </m.div>

        {/* ── 右下のデータアノテーション（プレミアム感演出） ── */}
        <m.div
          className="absolute bottom-10 right-8 sm:right-16 z-10 text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
        >
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
            Mobility Intelligence
          </p>
          <p className="text-[10px] font-mono text-white/20 mt-1">
            35°38′N 139°46′E
          </p>
        </m.div>
      </section>
    </ClientMotionWrapper>
  );
}
