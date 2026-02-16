import History from "@/components/History";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate History (組織沿革)",
  description: "設立から現在に至るまでの、三重野商会の挑戦と進化の軌跡。",
  openGraph: {
    title: "Corporate History (組織沿革) | MIENO CORP.",
    description: "設立から現在に至るまでの、三重野商会の挑戦と進化の軌跡。",
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
};

export default function HistoryPage() {
  return <History />;
}
