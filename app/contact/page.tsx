import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact (通信チャネル)",
  description: "作戦に関するお問い合わせ、および各種調整の連絡窓口。",
  openGraph: {
    title: "Contact (通信チャネル) | MIENO CORP.",
    description: "作戦に関するお問い合わせ、および各種調整の連絡窓口。",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <Contact />
    </div>
  );
}
