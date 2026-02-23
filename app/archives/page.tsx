import Archives from "@/components/Archives";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Archive } from "@/types/database";

export const metadata: Metadata = {
  title: "Operation Archives (作戦記録保管庫)",
  description: "Secure data storage for Mieno Corp operation logs. Access Level 3 Required.",
};

export default async function ArchivesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const { data: archives } = await supabase
    .from('archives')
    .select('*')
    .order('date', { ascending: false });

  return <Archives archives={(archives as Archive[]) || []} isAdmin={isAdmin} />;
}
