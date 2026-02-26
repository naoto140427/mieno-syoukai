'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function DoctrinePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 selection:bg-gray-200 pb-32">

      {/* Hero Section (CEO Profile) - Apple Leadership Style */}
      <section className="max-w-4xl mx-auto pt-32 pb-16 px-6 flex flex-col md:flex-row items-center md:items-start gap-10">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="shrink-0"
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            <Image
              src="/ceo.webp"
              alt="Mieno CEO"
              fill
              className="rounded-full object-cover shadow-2xl ring-1 ring-gray-900/5"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col justify-center pt-4 md:pt-8 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            三重野 <span className="text-3xl md:text-4xl font-light text-gray-400 ml-2">Mieno</span>
          </h1>
          <p className="text-sm md:text-base font-semibold tracking-widest text-gray-500 uppercase mt-4">
            Chief Executive Officer / 最高司令官
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

      {/* Doctrine Body */}
      <section className="max-w-3xl mx-auto px-6 text-lg leading-[2.2] text-gray-700 space-y-16">

        {/* Intro */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">DOCTRINE</h2>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">最高司令官からの通達</h3>

          <p className="font-bold text-xl text-gray-900 mb-8">
            「狂気（Madness）」こそが、我々の唯一の論理（Logic）である。
          </p>
          <p className="mb-6">
            現代社会は、あまりにも予測可能で、息が詰まるほど退屈なアルゴリズムに支配されています。GPSナビゲーションが提示する「最短ルート」をなぞり、予定時刻通りに目的地に到着し、何のリスクも負わずに帰路につく。最適化という名の下に漂白された、そのような「無菌状態の移動」に、果たして魂の躍動はあるのでしょうか。
          </p>
          <p className="mb-6">
            否。我々 MIENO CORP. は、そのように高度に最適化された日常に対する「強烈なバグ（異物）」として、この世界に存在しています。我々のミッションは、単なるA地点からB地点への物理的な空間移動ではありません。内燃機関の咆哮と、タイヤがアスファルトを削る摩擦音をシンフォニーとし、地球という広大なキャンバスに戦術的かつ前衛的な軌跡を刻み込む「極限のパフォーマンスアート」の探求です。
          </p>
          <p className="font-medium text-gray-900 pt-4">
            ここに、我々 MIENO CORP. の全クルー（機動戦力）を駆動させる、4つの絶対的コア・バリュー（行動規範）を宣言します。
          </p>
        </motion.div>

        {/* Value 1 */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h4 className="text-2xl font-bold mb-4 text-gray-900">
            1. The Rejection of &quot;Impossible&quot;<br/>
            <span className="text-lg font-normal text-gray-500 mt-1 block">（「無理」という概念の完全撤廃）</span>
          </h4>
          <p>
            我々の戦略プロトコルにおいて、「無理」「不可能」という変数は初期化の段階で完全に削除されています。作戦行動中、我々はしばしば過酷な事象に直面します。視界を奪うゲリラ豪雨、終わりの見えない渋滞、凍てつくような気温、そして肉体的な疲労のピーク。一般のライダーが「引き返す」「諦める」という合理的な選択をするそのポイントこそが、我々 MIENO CORP. にとっての「真の作戦開始時刻（H-Hour）」です。圧倒的な機動力と、常識を凌駕する精神力によって、我々はあらゆる外的障害を強行突破します。
          </p>
        </motion.div>

        {/* Value 2 */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h4 className="text-2xl font-bold mb-4 text-gray-900">
            2. Hyper-Agile Dynamic Routing<br/>
            <span className="text-lg font-normal text-gray-500 mt-1 block">（完全無計画という名の、究極のアジャイル戦術）</span>
          </h4>
          <p>
            事前に綿密に固定されたスケジュールは、現場で発生する偶発的なダイナミズムを完全に殺します。我々は、出発の直前まで明確な目的地を定義しないことすらあります。走行中、秒単位で変化する風の匂い、雲の流れ、路面状況、そして何より「あっちの道の方が、なんか面白そう」というクルー全員の野生の直感（インサイト）に基づき、リアルタイムでルートを再計算（リルート）し続けます。道に迷うことすらも、我々は「予期せぬ新規マーケットの開拓」と定義します。
          </p>
        </motion.div>

        {/* Value 3 */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h4 className="text-2xl font-bold mb-4 text-gray-900">
            3. Maximizing Psychological ROI<br/>
            <span className="text-lg font-normal text-gray-500 mt-1 block">（極限のエンターテインメントと狂気の最大化）</span>
          </h4>
          <p>
            我々は、エンジンを回している間、常に120%の熱量で「ふざけ倒す」ことにコミットしています。一見すると「キチガイ」とすら形容される我々の異常なテンションと行動原理は、決して無軌道で無思慮なものではありません。それは、重圧に満ちた現代社会において、クルーの心理的限界（リミッター）を強制解除し、精神的報酬（Psychological ROI）を最大化するための、極めてロジカルな戦術です。
          </p>
        </motion.div>

        {/* Value 4 */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h4 className="text-2xl font-bold mb-4 text-gray-900">
            4. Zero-Compromise Risk Management<br/>
            <span className="text-lg font-normal text-gray-500 mt-1 block">（絶対的生存戦略への執着）</span>
          </h4>
          <p>
            しかし、これらすべての狂気的かつ前衛的なアプローチは、たった一つの強固な地盤の上にのみ成り立っています。それは「いかなる状況下でも、全クルーが五体満足で生還する」という絶対の掟です。どれほど狂ったように走り、どれほどバカ騒ぎをしていようとも、我々の頭脳は常に最悪のシナリオ（Worst-case scenario）を並列処理でシミュレーションし、緻密なリスクヘッジを展開しています。安全第一（Safety First）という言葉は、我々にとってただのスローガンではなく、生存するためのOS（オペレーティングシステム）そのものです。
          </p>
        </motion.div>

        {/* Closing */}
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="pt-8">
          <p className="font-bold text-xl text-gray-900 mb-6">最後に。</p>
          <p className="mb-6">
            我々の果てしない作戦（ツーリング）に、最終的な目的地など存在しません。あるのは、共にスロットルを捻り、馬鹿話を叫びながら風を切り裂き、タイヤの端まで使い切る「今この瞬間」だけです。
          </p>
          <p className="mb-6">
            MIENO CORP. はこれからも、社会のレールから大きく逸脱した「狂気」と「安全」の極細のボーダーライン上を、満面の笑みで、フルスロットルで駆け抜けます。
          </p>
          <p className="font-medium text-gray-900">
            さあ、ヘルメットのシールドを下ろせ。あなたも、この美しく狂ったエコシステムへようこそ。
          </p>
        </motion.div>
      </section>
    </main>
  );
}
