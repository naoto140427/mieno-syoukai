'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 selection:bg-gray-200 pb-32">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 uppercase">
            Join the Frontline
          </h1>
          <p className="text-sm md:text-base font-semibold tracking-[0.2em] text-gray-400 uppercase">
            エージェント（機動戦力）募集 <span className="mx-2">/</span> Careers
          </p>
        </motion.div>
      </section>

      {/* Content Wrapper */}
      <div className="max-w-3xl mx-auto px-6">
        {/* Divider */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="w-full border-t border-gray-200 mb-20"
        />

        {/* Content Body */}
        <section className="text-lg leading-[2.2] text-gray-700 space-y-24">

          {/* THE INVITATION */}
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
              The Invitation
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
              最前線からの招待状
            </h3>
            <div className="space-y-6">
              <p>
                我々は、単なる「移動」を目的とする組織ではありません。
                <br className="hidden md:block"/>
                予測可能で退屈な日常という名のアルゴリズムに、致命的なバグを仕掛ける異端児です。
              </p>
              <p>
                MIENO CORP. が遂行するのは、内燃機関の咆哮と風の抵抗を完璧な調和へと導き、物理的な制約を超越する「極限のパフォーマンスアート（作戦行動）」。
                そこにあるのは、限界の先にある静寂と、魂を揺さぶる圧倒的な狂気（Madness）だけです。
              </p>
              <p className="font-bold text-gray-900 pt-4">
                今、我々はこの狂気を共有し、共に絶対的生存戦略を遂行できる新たな機動戦力（エージェント）を招集します。
                あなたの本能が、未知なる作戦領域を渇望しているなら。ここは、あなたの居場所です。
              </p>
            </div>
          </motion.div>

          {/* REQUIREMENTS */}
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
              Requirements
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
              要求されるスペック
            </h3>

            <p className="mb-10">
              我々がエージェントに求めるのは、妥協なき適性と、生存に対する異常なまでの執着です。
            </p>

            <div className="space-y-12">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-gray-900 mr-4"></span>
                  絶対要件（Must Have）
                </h4>
                <ul className="space-y-8">
                  <li className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1">1. 物理的アクセス権限</span>
                    <span className="text-gray-600">普通自動二輪免許以上の国家資格保持。（大型自動二輪免許保持者は、より高度な作戦領域へのアサインにおいて優遇される）</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1">2. 狂気への高い耐性</span>
                    <span className="text-gray-600">視界が極限まで制限される夜間作戦や、過酷な環境下での作戦行動に対する、極めて高い適性と持続的な集中力。</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1">3. 生還への絶対的義務</span>
                    <span className="text-gray-600">当社のコア・ドクトリンである「絶対的生存戦略」をいかなる状況下でも遵守し、作戦終了時の無傷での帰還を至上命題とする自己管理能力。</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-gray-300 mr-4"></span>
                  歓迎要件（Nice to Have）
                </h4>
                <ul className="space-y-8">
                  <li className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1">空間と軌跡の解読</span>
                    <span className="text-gray-600">複雑なGPXデータの解析能力、および直感的な地図の読解能力（ルーティング・センス）。</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1">異常環境下での演算能力</span>
                    <span className="text-gray-600">極限状態において、感情を完全に排し、冷徹かつ迅速に最適解を導き出す判断力と120%のエンタメ精神。</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* OUR PROMISE */}
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
              Our Promise
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
              我々のコミットメント
            </h3>
            <p className="mb-8">
              あなたの並外れた覚悟に対して、我々は比類なき体験と環境をもって報います。
            </p>
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#F5F5F7] border border-gray-100/50">
                <h4 className="text-lg font-bold text-gray-900 mb-2">統合戦術システムへの完全アクセス</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  MIENO CORP. の極秘アーカイブへのアクセス権限を付与。あなたの全作戦記録とテレメトリデータは、美しく洗練された軌跡として永遠に保存されます。
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-[#F5F5F7] border border-gray-100/50">
                <h4 className="text-lg font-bold text-gray-900 mb-2">最高司令部との直接作戦</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  CEO（最高司令官）との最前線での作戦行動。圧倒的なプレッシャーの中、言葉を持たないエンジン音だけの高度なコミュニケーションが、あなたの認識能力を次の次元へと引き上げます。
                </p>
              </div>
            </div>
          </motion.div>

        </section>

        {/* Call to Action */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mt-32 pt-16 border-t border-gray-200 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Are you ready to deploy?
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 text-white font-bold tracking-[0.1em] text-sm px-12 py-5 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            APPLY NOW（入隊志願）
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
