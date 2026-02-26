'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function DoctrinePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white pb-32">
      <div className="max-w-3xl mx-auto px-6 pt-32 md:pt-48">

        {/* Header Section */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          variants={fadeInUp}
          className="mb-24"
        >
          <h1 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
            DOCTRINE
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 leading-tight">
            最高司令官からの通達
          </h2>

          <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-900 mb-8">
            「狂気（Madness）」こそが、我々の唯一の論理（Logic）である。
          </p>

          <div className="text-lg leading-loose text-gray-600 space-y-8 font-sans">
            <p>
              現代社会は、あまりにも予測可能で、息が詰まるほど退屈なアルゴリズムに支配されています。GPSナビゲーションが提示する「最短ルート」をなぞり、予定時刻通りに目的地に到着し、何のリスクも負わずに帰路につく。最適化という名の下に漂白された、そのような「無菌状態の移動」に、果たして魂の躍動はあるのでしょうか。
            </p>
            <p>
              否。我々 MIENO CORP. は、そのように高度に最適化された日常に対する「強烈なバグ（異物）」として、この世界に存在しています。我々のミッションは、単なるA地点からB地点への物理的な空間移動ではありません。内燃機関の咆哮と、タイヤがアスファルトを削る摩擦音をシンフォニーとし、地球という広大なキャンバスに戦術的かつ前衛的な軌跡を刻み込む「極限のパフォーマンスアート」の探求です。
            </p>
            <p className="font-medium text-gray-900 pt-4">
              ここに、我々 MIENO CORP. の全クルー（機動戦力）を駆動させる、4つの絶対的コア・バリュー（行動規範）を宣言します。
            </p>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <div className="space-y-24">
            {/* Value 1 */}
            <motion.section
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    1. The Rejection of "Impossible"<br/>
                    <span className="text-lg font-normal text-gray-500 mt-1 block">（「無理」という概念の完全撤廃）</span>
                </h3>
                <p className="text-lg leading-loose text-gray-600">
                    我々の戦略プロトコルにおいて、「無理」「不可能」という変数は初期化の段階で完全に削除されています。作戦行動中、我々はしばしば過酷な事象に直面します。視界を奪うゲリラ豪雨、終わりの見えない渋滞、凍てつくような気温、そして肉体的な疲労のピーク。一般のライダーが「引き返す」「諦める」という合理的な選択をするそのポイントこそが、我々 MIENO CORP. にとっての「真の作戦開始時刻（H-Hour）」です。圧倒的な機動力と、常識を凌駕する精神力によって、我々はあらゆる外的障害を強行突破します。
                </p>
            </motion.section>

            {/* Value 2 */}
            <motion.section
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    2. Hyper-Agile Dynamic Routing<br/>
                    <span className="text-lg font-normal text-gray-500 mt-1 block">（完全無計画という名の、究極のアジャイル戦術）</span>
                </h3>
                <p className="text-lg leading-loose text-gray-600">
                    事前に綿密に固定されたスケジュールは、現場で発生する偶発的なダイナミズムを完全に殺します。我々は、出発の直前まで明確な目的地を定義しないことすらあります。走行中、秒単位で変化する風の匂い、雲の流れ、路面状況、そして何より「あっちの道の方が、なんか面白そう」というクルー全員の野生の直感（インサイト）に基づき、リアルタイムでルートを再計算（リルート）し続けます。道に迷うことすらも、我々は「予期せぬ新規マーケットの開拓」と定義します。
                </p>
            </motion.section>

            {/* Value 3 */}
            <motion.section
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    3. Maximizing Psychological ROI<br/>
                    <span className="text-lg font-normal text-gray-500 mt-1 block">（極限のエンターテインメントと狂気の最大化）</span>
                </h3>
                <p className="text-lg leading-loose text-gray-600">
                    我々は、エンジンを回している間、常に120%の熱量で「ふざけ倒す」ことにコミットしています。一見すると「キチガイ」とすら形容される我々の異常なテンションと行動原理は、決して無軌道で無思慮なものではありません。それは、重圧に満ちた現代社会において、クルーの心理的限界（リミッター）を強制解除し、精神的報酬（Psychological ROI）を最大化するための、極めてロジカルな戦術です。
                </p>
            </motion.section>

            {/* Value 4 */}
            <motion.section
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    4. Zero-Compromise Risk Management<br/>
                    <span className="text-lg font-normal text-gray-500 mt-1 block">（絶対的生存戦略への執着）</span>
                </h3>
                <p className="text-lg leading-loose text-gray-600">
                    しかし、これらすべての狂気的かつ前衛的なアプローチは、たった一つの強固な地盤の上にのみ成り立っています。それは「いかなる状況下でも、全クルーが五体満足で生還する」という絶対の掟です。どれほど狂ったように走り、どれほどバカ騒ぎをしていようとも、我々の頭脳は常に最悪のシナリオ（Worst-case scenario）を並列処理でシミュレーションし、緻密なリスクヘッジを展開しています。安全第一（Safety First）という言葉は、我々にとってただのスローガンではなく、生存するためのOS（オペレーティングシステム）そのものです。
                </p>
            </motion.section>
        </div>

        {/* Closing Section */}
        <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mt-32 pt-16 border-t border-gray-100"
        >
            <h3 className="text-xl font-bold mb-8 text-gray-900">最後に。</h3>
            <p className="text-lg leading-loose text-gray-600 mb-12">
                我々の果てしない作戦（ツーリング）に、最終的な目的地など存在しません。あるのは、共にスロットルを捻り、馬鹿話を叫びながら風を切り裂き、タイヤの端まで使い切る「今この瞬間」だけです。<br/>
                MIENO CORP. はこれからも、社会のレールから大きく逸脱した「狂気」と「安全」の極細のボーダーライン上を、満面の笑みで、フルスロットルで駆け抜けます。<br/>
                さあ、ヘルメットのシールドを下ろせ。あなたも、この美しく狂ったエコシステムへようこそ。
            </p>

            <div className="mt-16 text-right">
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                    MIENO CORP. Chief Executive Officer
                </p>
            </div>
        </motion.div>

      </div>
    </main>
  );
}
