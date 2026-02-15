import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

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
        className={`${inter.variable} ${notoSansJP.variable} antialiased font-sans text-mieno-text bg-mieno-gray`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
