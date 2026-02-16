"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Strategic Units", href: "/units" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "#" },
  { name: "Logistics", href: "/logistics" },
  { name: "History", href: "/history" },
  { name: "Store", href: "#" },
  { name: "Support", href: "/ir" },
  { name: "Contact", href: "/contact" },
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
            <Link href="/" className="-m-1.5 p-1.5 text-mieno-navy font-bold tracking-tight text-lg z-50 relative">
              MIENO CORP.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium leading-6 text-mieno-text opacity-100 transition-opacity duration-300 hover:opacity-70"
              >
                {item.name}
              </Link>
            ))}
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
                      className="block text-2xl font-bold leading-7 text-mieno-text hover:text-mieno-navy/70 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
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
                     href="/login"
                     className="flex items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-mieno-text hover:bg-gray-200"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
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
