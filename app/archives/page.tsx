import { Suspense } from "react";
import Archives from "@/components/Archives";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Archive } from "@/types/database";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Operation Archives (作戦記録保管庫)",
  description: "Secure data storage for Mieno Corp operation logs. Access Level 3 Required.",
};

async function ArchivesFetcher({ isAdmin }: { isAdmin: boolean }) {
  const supabase = await createClient();
  const { data: archives } = await supabase
    .from('archives')
    .select('*')
    .order('date', { ascending: false });

  return <Archives archives={(archives as Archive[]) || []} isAdmin={isAdmin} />;
}

function ArchivesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <Skeleton className="h-9 w-40 mb-1 bg-gray-200/50" />
            <Skeleton className="h-4 w-24 bg-gray-200/50" />
          </div>
          <div className="flex gap-2">
             <Skeleton className="h-10 w-48 rounded-full bg-gray-200/50" />
             <Skeleton className="h-10 w-36 rounded-full bg-gray-200/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map((i) => (
             <Skeleton key={i} className="h-64 lg:h-48 w-full rounded-2xl bg-white/50 border border-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ArchivesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <Suspense fallback={<ArchivesSkeleton />}>
      <ArchivesFetcher isAdmin={isAdmin} />
    </Suspense>
  );
}
