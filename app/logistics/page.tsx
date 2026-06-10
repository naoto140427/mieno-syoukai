import Logistics from "@/components/Logistics";
import { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Logistics (広域兵站・作戦経路)",
  description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
  openGraph: {
    title: "Logistics (広域兵站・作戦経路) | MIENO CORP.",
    description: "大分HQから全国へ展開する、次期広域展開作戦（フィールドワーク）の経路データ。",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export interface ArchiveTrack {
  id: number;
  title: string;
  date: string;
  distance_km: number | null;
  location_name: string | null;
  route_data: [number, number, number][] | [number, number][] | null;
}

async function getArchiveTracks(): Promise<ArchiveTrack[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('archives')
    .select('id, title, date, distance_km, location_name, route_data')
    .not('route_data', 'is', null)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching archive tracks:', error);
    return [];
  }
  return (data as ArchiveTrack[]) || [];
}

export default async function LogisticsPage() {
  const tracks = await getArchiveTracks();

  return (
    <div className="bg-black min-h-screen">
      <Logistics tracks={tracks} />
    </div>
  );
}
