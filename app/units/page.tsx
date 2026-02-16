import StrategicUnits from "@/components/StrategicUnits";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategic Units (機動戦力)",
  description: "株式会社三重野商会が保有する戦略的モビリティ・アセットの紹介。",
  openGraph: {
    title: "Strategic Units (機動戦力) | MIENO CORP.",
    description: "株式会社三重野商会が保有する戦略的モビリティ・アセットの紹介。",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function UnitsPage() {
  return <StrategicUnits />;
}
