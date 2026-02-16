"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TriangleAlert } from "lucide-react";

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl font-mono"
        >
          {/* Scanline overlay effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 mx-4 w-full max-w-2xl overflow-hidden border border-red-500/30 bg-black/80 p-1 shadow-[0_0_50px_rgba(220,38,38,0.3)]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-red-500/30 bg-red-950/20 px-4 py-2">
              <div className="flex items-center gap-2 text-red-500">
                <TriangleAlert className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-bold tracking-widest">SYSTEM ALERT: CLASSIFIED</span>
              </div>
              <button onClick={onClose} className="text-red-500 hover:text-red-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 text-center">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
                className="mb-8 text-3xl font-black text-red-600 md:text-5xl"
              >
                [TOP SECRET / CLASSIFIED]
              </motion.div>

              <div className="space-y-6 text-left">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-red-500">
                    真の目的 (True Objective):
                  </h3>
                  <p className="text-xl font-medium text-white md:text-2xl">
                    「週末のツーリングメンバー＆飲み仲間、絶賛募集中。」
                  </p>
                </div>

                <div className="rounded border border-red-500/20 bg-red-950/10 p-4">
                  <p className="text-sm text-gray-300">
                    ※機動戦力（バイク）を持っていなくても、BBQや車での参加（ロジスティクス支援）は大歓迎です。
                  </p>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={onClose}
                  className="group relative overflow-hidden rounded-sm border border-red-500 bg-transparent px-8 py-3 text-red-500 transition-colors hover:bg-red-500 hover:text-black"
                >
                  <span className="relative z-10 font-bold">[ 通信を終了する ]</span>
                </button>
              </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-red-500" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-red-500" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-red-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
