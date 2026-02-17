import Archives from "@/components/Archives";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operation Archives (作戦記録保管庫)",
  description: "Secure data storage for Mieno Corp operation logs. Access Level 3 Required.",
};

export default function ArchivesPage() {
  return <Archives />;
}
