"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";

const navItems = [
  { name: "機動戦力", en: "UNITS", href: "/units" },
  { name: "事業領域", en: "SERVICES", href: "/services" },
  { name: "備品管理", en: "INVENTORY", href: "/inventory" },
  { name: "広域兵站", en: "LOGISTICS", href: "/logistics" },
  { name: "作戦記録", en: "ARCHIVES", href: "/archives" },
  { name: "沿革", en: "HISTORY", href: "/history" },
  { name: "IR情報", en: "IR", href: "/ir" },
  { name: "お問い合わせ", en: "CONTACT", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md"
      >
        <nav className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 text-mieno-navy font-bold tracking-tight text-lg z-50 relative"
            >
              MIENO CORP.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col items-center justify-center text-center"
              >
                <span className="text-sm font-bold text-mieno-text transition-colors duration-300 group-hover:text-mieno-navy">
                  {item.name}
                </span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-mieno-navy/70">
                  {item.en}
                </span>
              </Link>
            ))}

            {/* Admin Link (Desktop) */}
            <Link
              href="/admin"
              className="ml-4 group flex flex-col items-center justify-center text-center px-3 py-1 rounded-md border border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
            >
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-gray-400 group-hover:text-mieno-navy transition-colors" />
                <span className="text-sm font-bold text-gray-500 transition-colors duration-300 group-hover:text-mieno-navy">
                  管理コンソール
                </span>
              </div>
              <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-mieno-navy/70">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {/* Right side icons if needed */}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-white/80 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 h-12 border-b border-gray-200/50">
              <Link
                href="/"
                className="-m-1.5 p-1.5 text-mieno-navy font-bold tracking-tight text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                MIENO CORP.
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-baseline gap-3 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl font-bold leading-7 text-mieno-text group-hover:text-mieno-navy/70 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest group-hover:text-mieno-navy/50 transition-colors">
                        {item.en}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 pt-8 border-t border-gray-200/50">
                <p className="text-sm text-gray-500 font-medium mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                     href="/contact"
                     className="flex items-center justify-center rounded-xl bg-mieno-navy px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-mieno-navy/90"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                  <Link
                     href="/admin"
                     className="flex items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-mieno-text hover:bg-gray-200 border border-gray-200"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Console
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
