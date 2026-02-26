import Logistics from "@/components/Logistics";
import LogisticsClient from "@/components/LogisticsClient";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getConsumables, getTools } from "@/app/actions/logistics";

export const metadata: Metadata = {
  title: "Logistics (広域兵站・作戦経路)",
  description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
  openGraph: {
    title: "Logistics (広域兵站・作戦経路) | MIENO CORP.",
    description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default async function LogisticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const [consumables, tools] = await Promise.all([
    getConsumables(),
    getTools()
  ]);

  return (
    <div className="bg-black min-h-screen">
      <Logistics />
      <section id="inventory" className="relative z-10 bg-mieno-gray py-24">
         <LogisticsClient
            consumables={consumables}
            tools={tools}
            isAdmin={isAdmin}
         />
      </section>
    </div>
  );
}
