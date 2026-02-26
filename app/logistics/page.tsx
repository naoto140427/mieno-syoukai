import Logistics from "@/components/Logistics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logistics (広域兵站・作戦経路)",
  description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
  openGraph: {
    title: "Logistics (広域兵站・作戦経路) | MIENO CORP.",
    description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function LogisticsPage() {
  return (
    <div className="bg-black min-h-screen">
      <Logistics />
    </div>
  );
}
