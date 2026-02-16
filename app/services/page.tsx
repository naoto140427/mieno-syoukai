import MienoEcosystem from "@/components/MienoEcosystem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mieno Ecosystem (事業領域)",
  description: "Mieno Drive, Mieno Eats, Mieno Works... 多角的に展開する戦略的エコシステム。",
  openGraph: {
    title: "Mieno Ecosystem (事業領域) | MIENO CORP.",
    description: "Mieno Drive, Mieno Eats, Mieno Works... 多角的に展開する戦略的エコシステム。",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function ServicesPage() {
  return <MienoEcosystem />;
}
