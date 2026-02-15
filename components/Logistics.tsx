'use client';

import { motion } from 'framer-motion';

const Logistics = () => {
  // SVG Path Data for simplified Japan map
  const japanMapPaths = [
    // Kyushu
    "M 120 450 L 180 430 L 190 500 L 120 480 Z",
    // Shikoku
    "M 220 440 L 300 420 L 290 470 L 220 460 Z",
    // Honshu (Simplified)
    "M 190 410 L 250 380 L 450 300 L 600 200 L 650 250 L 550 350 L 400 380 L 300 410 Z",
    // Hokkaido
    "M 620 180 L 700 150 L 750 200 L 650 220 Z"
  ];

  // Route Path: Oita (approx 160, 460) -> Yamanashi (approx 500, 330)
  // Circuit board style path
  const routePath = "M 160 460 L 250 460 L 350 360 L 500 360 L 500 330";

  return (
    <section className="bg-black text-white py-24 overflow-hidden relative">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Text Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2 uppercase">
              Global Operations Network
            </h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Logistics Strategy
            </h2>
            <div className="h-1 w-20 bg-cyan-500 mb-8 rounded-full"></div>

            <div className="space-y-6 text-gray-300">
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  Operation: Yuru-Camp
                </h4>
                <p className="font-mono text-xs text-gray-500 mb-4">CODE: 2026-MAR-YC // TARGET: FUJI-AREA</p>
                <p className="leading-relaxed">
                  九州（大分・春日浦エリア拠点）から中部（長野・山梨エリア）への長距離展開作戦。
                  「ほったらかし温泉」周辺の地形データ収集および野営（キャンプ）適性の検証を実施する。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/30 p-4 rounded border border-gray-800">
                  <h5 className="text-xs font-mono text-gray-500 uppercase mb-1">Mission Objective</h5>
                  <p className="font-medium text-sm">3日間にわたる単独長距離ミッションにおける、機材の耐久性と兵站（ロジスティクス）の最適化テスト。</p>
                </div>
                <div className="bg-gray-900/30 p-4 rounded border border-gray-800">
                  <h5 className="text-xs font-mono text-gray-500 uppercase mb-1">Status</h5>
                  <p className="font-medium text-sm text-cyan-400">Planning Phase (計画段階)</p>
                  <p className="text-xs text-gray-500 mt-1">Execution: Mar 2-4</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Map (SVG) */}
        <div className="w-full lg:w-1/2 relative aspect-[4/3] bg-gray-900/20 rounded-xl overflow-hidden border border-gray-800 shadow-2xl backdrop-blur-sm">
          <div className="absolute top-4 left-4 z-20">
             <span className="text-[10px] font-mono text-cyan-500/50">SYSTEM: ONLINE</span>
          </div>
          <div className="absolute bottom-4 right-4 z-20">
             <span className="text-[10px] font-mono text-cyan-500/50">COORDINATES: 35.6895° N, 139.6917° E</span>
          </div>

          <motion.svg
            viewBox="0 0 800 600"
            className="w-full h-full p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Map Outlines */}
            {japanMapPaths.map((path, i) => (
              <motion.path
                key={i}
                d={path}
                fill="rgba(30, 41, 59, 0.3)"
                stroke="rgba(71, 85, 105, 0.5)"
                strokeWidth="1"
                variants={{
                  hidden: { opacity: 0, pathLength: 0 },
                  visible: { opacity: 1, pathLength: 1, transition: { duration: 1.5, ease: "easeInOut", delay: i * 0.2 } }
                }}
              />
            ))}

            {/* Route Line */}
            <motion.path
              d={routePath}
              fill="none"
              stroke="#06b6d4" // cyan-500
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 4px #06b6d4)"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: "easeInOut", delay: 1.5 } }
              }}
            />

            {/* Start Point (Oita) */}
            <motion.circle
              cx="160" cy="460" r="4"
              fill="#fff"
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { delay: 1.5, type: "spring" } }
              }}
            />
            <motion.text x="140" y="490" fill="white" fontSize="12" fontFamily="monospace" opacity="0.7">OITA HQ</motion.text>

            {/* End Point (Yamanashi) */}
            <motion.g
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { delay: 3.5, type: "spring" } } // Appears after route is drawn
              }}
            >
              <circle cx="500" cy="330" r="6" fill="#06b6d4" />
              <circle cx="500" cy="330" r="12" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.5">
                <animate attributeName="r" from="6" to="20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="520" y="335" fill="#06b6d4" fontSize="14" fontFamily="monospace" fontWeight="bold">TARGET: YAMANASHI</text>
            </motion.g>

          </motion.svg>
        </div>

      </div>
    </section>
  );
};

export default Logistics;
