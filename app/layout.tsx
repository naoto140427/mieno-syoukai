import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "株式会社三重野商会 | MIENO CORP.",
    template: "%s | MIENO CORP.",
  },
  description: "変革の風を、二輪で切り裂く。路面と対話し、未踏の地に足跡（タイヤ痕）を残す戦略的モビリティ・カンパニー。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://mieno-syoukai.vercel.app/",
    siteName: "株式会社三重野商会",
    title: "株式会社三重野商会 | MIENO CORP.",
    description: "変革の風を、二輪で切り裂く。路面と対話し、未踏の地に足跡（タイヤ痕）を残す戦略的モビリティ・カンパニー。",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "MIENO CORP. OGP Image",
      },
      
    ],
  },
  manifest: '/manifest.json',
  twitter: {
    card: "summary_large_image",
    title: "株式会社三重野商会 | MIENO CORP.",
    description: "変革の風を、二輪で切り裂く。戦略的モビリティ・カンパニー。",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`antialiased font-sans text-mieno-text bg-mieno-gray`}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-noto-sans-jp: 'Noto Sans JP', sans-serif;
          }
        `}} />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
