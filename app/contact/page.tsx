import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact (通信回線)",
  description: "株式会社三重野商会への各種お問い合わせ・作戦支援要請はこちらから承ります。",
  openGraph: {
    title: "Contact (通信回線) | MIENO CORP.",
    description: "株式会社三重野商会への各種お問い合わせ・作戦支援要請はこちらから承ります。",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Contact />
    </div>
  );
}
