'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] text-gray-800 selection:bg-gray-200 pb-32 pt-32">

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            エージェント募集 <span className="text-2xl md:text-3xl font-light text-gray-400 ml-2">CAREERS</span>
          </h1>
          <p className="text-sm md:text-base font-semibold tracking-widest text-gray-500 uppercase">
            Join the Mieno Corp.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <motion.div
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-3xl mx-auto px-6"
      >
        <div className="w-full border-t border-gray-200 mb-16"></div>
      </motion.div>

      {/* Content Body */}
      <section className="max-w-3xl mx-auto px-6 text-lg leading-[2.2] text-gray-700 space-y-20">

        {/* The Invitation */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">THE INVITATION</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">招待状</h3>

          <p className="mb-6 font-medium">
            私たちは、単なる移動を是としない。<br className="hidden md:block"/>
            路面と深く対話し、未踏の地に独自の軌跡（タイヤ痕）を刻み込む変革者である。
          </p>
          <p className="mb-6">
            風の抵抗、エンジンの鼓動、アスファルトの冷徹な感触。<br />
            それらすべてを完璧な調和へと導き、物理的な制約を超越する。<br />
            限界の先にある静寂を求め、日常という名の退屈を破壊する。
          </p>
          <p className="font-bold text-gray-900 mt-8">
            今、MIENO CORP.は、この静かなる狂気を共有できる新たな機動戦力（エージェント）を招集する。<br />
            あなたの本能が、未知なる作戦行動を渇望しているなら。<br />
            ここは、あなたの場所だ。
          </p>
        </motion.div>

        {/* Requirements */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">REQUIREMENTS</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">必須要件</h3>

          <p className="mb-8">
            我々が求めるのは、妥協なき適性と、生存に対する異常なまでの執着である。
          </p>

          <div className="space-y-10">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-gray-900 pl-4">Must Have (絶対要件)</h4>
              <ul className="list-none space-y-6">
                <li className="flex flex-col">
                  <span className="font-bold text-gray-900">物理的アクセス権限</span>
                  <span className="text-gray-600">普通自動二輪免許以上の国家資格保持。（大型自動二輪免許保持者は、より高度な作戦領域へのアサインにおいて優遇される）</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-gray-900">闇との親和性</span>
                  <span className="text-gray-600">視界が極限まで制限される夜間作戦（ナイトツーリング）に対する、極めて高い適性と持続的な集中力。</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-gray-900">生還への絶対的義務</span>
                  <span className="text-gray-600">当社のコア・ドクトリンである「絶対的生存戦略（安全第一）」をいかなる状況下でも遵守し、作戦終了時の無傷での帰還を至上命題とする自己管理能力。</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-gray-400 pl-4">Nice to Have (歓迎要件)</h4>
              <ul className="list-none space-y-6">
                <li className="flex flex-col">
                  <span className="font-bold text-gray-900">空間と軌跡の解読</span>
                  <span className="text-gray-600">複雑なGPXデータの解析能力、および直感的な地図の読解能力。</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-gray-900">異常環境下での演算能力</span>
                  <span className="text-gray-600">極限状態（予期せぬ雨天、劣悪な路面状況）において、感情を完全に排し、冷徹かつ迅速に最適解を導き出す判断力。</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Our Promise */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">OUR PROMISE</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">我々の約束</h3>

          <p className="mb-8">
            あなたの覚悟に対して、我々は比類なき体験と環境をもって報いる。
          </p>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-3">最新鋭戦術システムへの完全アクセス</h4>
              <p className="text-gray-600">
                現在のこのプラットフォームをはじめとする、MIENO CORP.の統合戦術システムへのアクセス権限を付与。あなたの全作戦記録とテレメトリデータは、美しく洗練されたアーカイブとして永遠に刻まれる。
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-3">最高司令官との前線配備</h4>
              <p className="text-gray-600">
                CEO（最高司令官）との直接的な作戦行動（ツーリング）への参加。最前線での圧倒的なプレッシャーの中、言葉を持たないエンジン音だけの高度なコミュニケーションが、あなたの認識能力を次の次元へと引き上げる。
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action placeholder - static text since no real form exists yet */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="pt-12 pb-8 text-center">
             <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">Ready to deploy?</p>
             <p className="text-gray-600 font-medium">現在、新規エージェントの募集は非公開ルート（リファラル）のみで受け付けています。<br className="hidden md:block"/>コンタクトフォームより機密通信を送信してください。</p>
        </motion.div>

      </section>
    </main>
  );
}
