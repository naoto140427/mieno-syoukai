'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function CareersPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero section parallax values
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Reveal Text component for elegant typography masking
  const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        variants={{
          hidden: { opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' },
          visible: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }
        }}
      >
        {children}
      </motion.div>
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <main ref={containerRef} className="text-gray-800 selection:bg-gray-200">

      {/* Sticky Hero Section */}
      <section className="h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden z-0 bg-[#F5F5F7]">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="text-center px-6"
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900 mb-6 uppercase">
            JOIN THE<br />SYNDICATE.
          </h1>
          <p className="text-sm md:text-base font-bold tracking-[0.4em] text-gray-400 uppercase">
            エージェント（機動戦力）募集 <span className="mx-2">/</span> Careers
          </p>
        </motion.div>
      </section>

      {/* Content Spacer to allow scrolling past sticky hero */}
      <div className="h-screen w-full pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 bg-white rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] py-32">
        <div className="max-w-3xl mx-auto px-6">

          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full border-t border-gray-200 mb-32"
          />

          {/* Content Body */}
          <section className="text-lg leading-[2.2] text-gray-700 space-y-40">

            {/* THE INVITATION */}
            <div>
              <RevealText>
                <h2 className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6">
                  The Invitation
                </h2>
              </RevealText>
              <RevealText delay={0.1}>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12">
                  最前線からの招待状
                </h3>
              </RevealText>

              <div className="space-y-8">
                <RevealText delay={0.2}>
                  <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
                    我々は、単なる「移動」を目的とする組織ではありません。<br className="hidden md:block"/>
                    予測可能で退屈な日常という名のアルゴリズムに、致命的なバグを仕掛ける異端児です。
                  </p>
                </RevealText>
                <RevealText delay={0.3}>
                  <p>
                    MIENO CORP. が遂行するのは、内燃機関の咆哮と風の抵抗を完璧な調和へと導き、物理的な制約を超越する「極限のパフォーマンスアート（作戦行動）」。
                    そこにあるのは、限界の先にある静寂と、魂を揺さぶる圧倒的な狂気（Madness）だけです。
                  </p>
                </RevealText>
                <RevealText delay={0.4}>
                  <p className="font-bold text-gray-900 pt-8 border-t border-gray-100">
                    今、我々はこの狂気を共有し、共に絶対的生存戦略を遂行できる新たな機動戦力（エージェント）を招集します。
                    あなたの本能が、未知なる作戦領域を渇望しているなら。ここは、あなたの居場所です。
                  </p>
                </RevealText>
              </div>
            </div>

            {/* REQUIREMENTS */}
            <div>
              <RevealText>
                <h2 className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6">
                  Requirements
                </h2>
              </RevealText>
              <RevealText delay={0.1}>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12">
                  要求されるスペック
                </h3>
              </RevealText>

              <RevealText delay={0.2}>
                <p className="mb-16 text-xl text-gray-500">
                  我々がエージェントに求めるのは、妥協なき適性と、生存に対する異常なまでの執着です。
                </p>
              </RevealText>

              <div className="space-y-20">
                <RevealText delay={0.3}>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                      <span className="w-3 h-3 bg-gray-900 mr-6"></span>
                      絶対要件（Must Have）
                    </h4>
                    <ul className="space-y-12 pl-9 border-l border-gray-100">
                      <li className="flex flex-col relative before:content-[''] before:absolute before:-left-9 before:top-2 before:w-3 before:h-px before:bg-gray-300">
                        <span className="font-bold text-gray-900 text-xl mb-3">1. 物理的アクセス権限</span>
                        <span className="text-gray-600">普通自動二輪免許以上の国家資格保持。（大型自動二輪免許保持者は、より高度な作戦領域へのアサインにおいて優遇される）</span>
                      </li>
                      <li className="flex flex-col relative before:content-[''] before:absolute before:-left-9 before:top-2 before:w-3 before:h-px before:bg-gray-300">
                        <span className="font-bold text-gray-900 text-xl mb-3">2. 狂気への高い耐性</span>
                        <span className="text-gray-600">視界が極限まで制限される夜間作戦や、過酷な環境下での作戦行動に対する、極めて高い適性と持続的な集中力。</span>
                      </li>
                      <li className="flex flex-col relative before:content-[''] before:absolute before:-left-9 before:top-2 before:w-3 before:h-px before:bg-gray-300">
                        <span className="font-bold text-gray-900 text-xl mb-3">3. 生還への絶対的義務</span>
                        <span className="text-gray-600">当社のコア・ドクトリンである「絶対的生存戦略」をいかなる状況下でも遵守し、作戦終了時の無傷での帰還を至上命題とする自己管理能力。</span>
                      </li>
                    </ul>
                  </div>
                </RevealText>

                <RevealText delay={0.4}>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                      <span className="w-3 h-3 bg-gray-300 mr-6"></span>
                      歓迎要件（Nice to Have）
                    </h4>
                    <ul className="space-y-12 pl-9 border-l border-gray-100">
                      <li className="flex flex-col relative before:content-[''] before:absolute before:-left-9 before:top-2 before:w-3 before:h-px before:bg-gray-200">
                        <span className="font-bold text-gray-900 text-xl mb-3">空間と軌跡の解読</span>
                        <span className="text-gray-600">複雑なGPXデータの解析能力、および直感的な地図の読解能力（ルーティング・センス）。</span>
                      </li>
                      <li className="flex flex-col relative before:content-[''] before:absolute before:-left-9 before:top-2 before:w-3 before:h-px before:bg-gray-200">
                        <span className="font-bold text-gray-900 text-xl mb-3">異常環境下での演算能力</span>
                        <span className="text-gray-600">極限状態において、感情を完全に排し、冷徹かつ迅速に最適解を導き出す判断力と120%のエンタメ精神。</span>
                      </li>
                    </ul>
                  </div>
                </RevealText>
              </div>
            </div>

            {/* OUR PROMISE */}
            <div>
              <RevealText>
                <h2 className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6">
                  Our Promise
                </h2>
              </RevealText>
              <RevealText delay={0.1}>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12">
                  我々のコミットメント
                </h3>
              </RevealText>
              <RevealText delay={0.2}>
                <p className="mb-12 text-xl text-gray-500">
                  あなたの並外れた覚悟に対して、我々は比類なき体験と環境をもって報います。
                </p>
              </RevealText>

              <div className="space-y-8">
                <RevealText delay={0.3}>
                  <div className="p-10 md:p-12 rounded-[2rem] bg-[#F5F5F7] border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">統合戦術システムへの完全アクセス</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      MIENO CORP. の極秘アーカイブへのアクセス権限を付与。あなたの全作戦記録とテレメトリデータは、美しく洗練された軌跡として永遠に保存されます。
                    </p>
                  </div>
                </RevealText>
                <RevealText delay={0.4}>
                  <div className="p-10 md:p-12 rounded-[2rem] bg-[#F5F5F7] border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">最高司令部との直接作戦</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      CEO（最高司令官）との最前線での作戦行動。圧倒的なプレッシャーの中、言葉を持たないエンジン音だけの高度なコミュニケーションが、あなたの認識能力を次の次元へと引き上げます。
                    </p>
                  </div>
                </RevealText>
              </div>
            </div>

          </section>

          {/* Call to Action */}
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mt-40 pt-20 border-t border-gray-200 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12">
              Are you ready to deploy?
            </h2>
            <Link
              href="/contact"
              className="inline-block bg-gray-900 text-white font-bold tracking-[0.2em] text-sm px-16 py-6 rounded-full hover:bg-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              APPLY NOW（入隊志願）
            </Link>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
