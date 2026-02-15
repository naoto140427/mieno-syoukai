"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { name: "Strategic Units", href: "/units" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "#" },
  { name: "Logistics", href: "/logistics" },
  { name: "History", href: "/history" },
  { name: "Store", href: "#" },
  { name: "Support", href: "/ir" },
];

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-mieno-navy font-bold tracking-tight text-lg">
            MIENO CORP.
          </Link>
        </div>
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
        {/* Mobile menu fallback (simple horizontal scroll for now if needed, or hidden) */}
        <div className="flex lg:hidden overflow-x-auto gap-x-4 pb-1">
           {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-medium leading-6 text-mieno-text whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* Right side icons if needed */}
        </div>
      </nav>
    </motion.header>
  );
}
