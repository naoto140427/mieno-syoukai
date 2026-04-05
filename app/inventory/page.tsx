import { Suspense } from "react";
import Inventory from "@/components/Inventory";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Consumable, Tool } from "@/types/database";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Resource & Inventory (装備・資材管理)",
  description: "Internal ERP for Mieno Corp. - Manage consumables, tools, and equipment status.",
};

async function InventoryFetcher({ isAdmin }: { isAdmin: boolean }) {
  const supabase = await createClient();
  const [consumablesRes, toolsRes] = await Promise.all([
    supabase.from('consumables').select('*').order('id', { ascending: true }),
    supabase.from('tools').select('*').order('id', { ascending: true })
  ]);

  const consumables = (consumablesRes.data as Consumable[]) || [];
  const tools = (toolsRes.data as Tool[]) || [];

  return <Inventory consumables={consumables} tools={tools} isAdmin={isAdmin} />;
}

function InventorySkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <Skeleton className="h-9 w-64 mb-1 bg-gray-200/50" />
            <Skeleton className="h-4 w-32 bg-gray-200/50" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full bg-gray-200/50" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-48 bg-gray-200/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <Skeleton key={i} className="h-56 w-full rounded-2xl bg-white/50 border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryFetcher isAdmin={isAdmin} />
    </Suspense>
  );
}
