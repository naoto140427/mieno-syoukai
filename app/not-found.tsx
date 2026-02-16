'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {/* Background Noise/Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}
      />

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center px-4"
      >
        {/* Glitchy 404 Text */}
        <motion.h1
          className="text-9xl md:text-[12rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 select-none"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-xl md:text-3xl font-mono tracking-widest text-red-500 uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            DESTINATION UNREACHABLE
          </h2>

          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            指定された座標（URL）は存在しないか、現在アクセス権限がありません。
            <br />
            直ちに正規ルートへ復帰してください。
          </p>

          <div className="pt-8">
            <Link href="/" className="inline-block group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-transparent border border-white/20 text-white font-mono text-sm tracking-wider uppercase overflow-hidden group-hover:border-white/50 transition-colors"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  [ HQ（トップページ）へ帰還する ]
                </span>
                <div className="absolute inset-0 bg-white/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 font-mono text-xs text-gray-600">
        ERR_CODE: OX_NOT_FOUND
      </div>
      <div className="absolute top-10 right-10 font-mono text-xs text-gray-600">
        SYS_STATUS: CRITICAL
      </div>
    </div>
  );
}
