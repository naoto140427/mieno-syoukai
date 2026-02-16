import PerformanceReport from "@/components/PerformanceReport";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Report (活動実績)",
  description: "インフラ踏破距離、地域貢献度、エンゲージメント率などの主要業績指標 (KPI) の報告。",
  openGraph: {
    title: "Performance Report (活動実績) | MIENO CORP.",
    description: "インフラ踏破距離、地域貢献度、エンゲージメント率などの主要業績指標 (KPI) の報告。",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function IRPage() {
  return <PerformanceReport />;
}
