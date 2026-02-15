'use client';

import { motion } from 'framer-motion';

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
// Smooth curve using cubic bezier
const routePath = "M 160 460 C 250 460, 350 360, 500 330";

const Logistics = () => {
  return (
    <section className="min-h-screen bg-black text-white py-24 px-6 overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 w-full h-full">

        {/* Text Content (Left / Top) */}
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <h3 className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
                Strategic Logistics Division
              </h3>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Logistics Operations
            </h2>

            <div className="space-y-6 text-gray-300 font-light">
              {/* Mission Details Card */}
              <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                   <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9.553 2.276A1 1 0 009 2.118v1.764"></path></svg>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Operation Code</h4>
                    <p className="text-xl text-white font-medium tracking-wide">Yuru-Camp (Mar 2026)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Schedule</h4>
                      <p className="text-sm text-cyan-100 font-mono">2026.03.02 - 03.04</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Asset</h4>
                      <p className="text-sm text-cyan-100 font-mono">SERENA LUXION (2025)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Route</h4>
                    <p className="text-sm leading-relaxed text-gray-300">
                      大分（宮河内ベース） 〜 山梨・長野エリア<br/>
                      <span className="text-xs text-gray-500">（ほったらかし温泉周辺・富士五湖エリア）</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                     <h4 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Mission Objective</h4>
                     <ul className="list-disc list-inside text-sm space-y-1 text-gray-400 marker:text-cyan-500">
                       <li>単独長距離機動におけるProPILOT 2.0のデータ収集および兵站（ロジスティクス）の最適化テスト。</li>
                       <li>聖地巡礼フィールドワークおよび野営（キャンプ）適性の検証。</li>
                     </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Visualization (Right / Bottom) */}
        <div className="w-full lg:w-1/2 aspect-[4/3] relative rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-[0_0_40px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

           {/* UI Elements */}
           <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
             <span className="text-[10px] font-mono text-cyan-500 tracking-widest animate-pulse">SYSTEM STATUS: ONLINE</span>
             <span className="text-[10px] font-mono text-gray-600">LAT: 35.6895 N / LNG: 139.6917 E</span>
           </div>

           <div className="absolute bottom-4 right-4 z-20 text-right">
             <span className="text-[10px] font-mono text-cyan-500 tracking-widest block">TARGET ACQUISITION</span>
             <span className="text-[10px] font-mono text-gray-600">DISTANCE: 850KM (EST)</span>
           </div>

           <motion.svg
             viewBox="0 0 800 600"
             className="w-full h-full p-4 lg:p-8"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
           >
             {/* Map Outlines */}
             {japanMapPaths.map((path, i) => (
               <motion.path
                 key={i}
                 d={path}
                 fill="rgba(30, 41, 59, 0.4)"
                 stroke="rgba(100, 116, 139, 0.3)"
                 strokeWidth="1"
                 variants={{
                   hidden: { opacity: 0, pathLength: 0 },
                   visible: {
                     opacity: 1,
                     pathLength: 1,
                     transition: {
                       duration: 2,
                       ease: "easeInOut",
                       delay: i * 0.3
                     }
                   }
                 }}
               />
             ))}

             {/* Route Line Animation */}
             <motion.path
               d={routePath}
               fill="none"
               stroke="#06b6d4" // cyan-500
               strokeWidth="4"
               strokeLinecap="round"
               strokeLinejoin="round"
               filter="drop-shadow(0 0 6px #06b6d4)"
               variants={{
                 hidden: { pathLength: 0, opacity: 0 },
                 visible: {
                   pathLength: 1,
                   opacity: 1,
                   transition: {
                     duration: 3,
                     ease: "easeInOut",
                     delay: 1.5
                   }
                 }
               }}
             />

             {/* Glowing Pulse Effect on Route */}
             <motion.path
               d={routePath}
               fill="none"
               stroke="#fff"
               strokeWidth="1"
               strokeLinecap="round"
               strokeLinejoin="round"
               opacity="0.5"
               variants={{
                 hidden: { pathLength: 0, opacity: 0 },
                 visible: {
                   pathLength: 1,
                   opacity: [0, 0.8, 0],
                   transition: {
                     duration: 3,
                     ease: "easeInOut",
                     delay: 1.5,
                     repeat: Infinity,
                     repeatType: "reverse",
                     repeatDelay: 1
                   }
                 }
               }}
             />

             {/* Start Point (Oita) */}
             <motion.g
               initial={{ scale: 0, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 1.5, type: "spring" }}
             >
               <circle cx="160" cy="460" r="4" fill="#fff" />
               <circle cx="160" cy="460" r="10" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
               <text x="140" y="485" fill="#9ca3af" fontSize="10" fontFamily="monospace" letterSpacing="1">OITA HQ</text>
             </motion.g>

             {/* End Point (Yamanashi) */}
             <motion.g
               variants={{
                 hidden: { scale: 0, opacity: 0, y: -20 },
                 visible: {
                   scale: 1,
                   opacity: 1,
                   y: 0,
                   transition: {
                     delay: 4.5, // Appears after route is drawn (1.5 delay + 3 duration)
                     type: "spring",
                     stiffness: 200,
                     damping: 10
                   }
                 }
               }}
             >
               {/* Pin Body */}
               <path d="M500 330 L500 310" stroke="#06b6d4" strokeWidth="2" />
               <circle cx="500" cy="310" r="6" fill="#06b6d4" className="animate-pulse" />

               {/* Ripple Effect */}
               <circle cx="500" cy="310" r="12" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.5">
                 <animate attributeName="r" from="6" to="24" dur="2s" repeatCount="indefinite" />
                 <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
               </circle>

               {/* Label */}
               <text x="520" y="315" fill="#06b6d4" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="1">TARGET: YAMANASHI</text>
             </motion.g>

           </motion.svg>
        </div>

      </div>
    </section>
  );
};

export default Logistics;
