import Inventory from "@/components/Inventory";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Consumable, Tool } from "@/types/database";

export const metadata: Metadata = {
  title: "Resource & Inventory (装備・資材管理)",
  description: "Internal ERP for Mieno Corp. - Manage consumables, tools, and equipment status.",
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const [consumablesRes, toolsRes] = await Promise.all([
    supabase.from('consumables').select('*').order('id', { ascending: true }),
    supabase.from('tools').select('*').order('id', { ascending: true })
  ]);

  const consumables = (consumablesRes.data as Consumable[]) || [];
  const tools = (toolsRes.data as Tool[]) || [];

  return <Inventory consumables={consumables} tools={tools} isAdmin={isAdmin} />;
}
