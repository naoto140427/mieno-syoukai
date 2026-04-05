import { Suspense } from 'react';
import { getUnitBySlug } from '@/app/actions/units';
import { createClient } from '@/lib/supabase/server';
import UnitDetailClient from '@/components/UnitDetailClient';
import { Unit } from '@/types/database';
import { Skeleton } from '@/components/ui/Skeleton';

// 読み込み中のスケルトン画面（CLS防止用）
function UnitDetailSkeleton() {
  return (
    <div className="min-h-screen bg-mieno-gray flex flex-col">
      {/* ヒーローセクション スケルトン */}
      <div className="relative h-screen bg-gray-900 overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none border-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex items-end">
          <div className="container mx-auto px-6 pb-24 z-10">
            <div className="space-y-6">
              {/* Role */}
              <Skeleton className="h-6 w-48 mb-4 bg-white/20" />
              {/* Title */}
              <Skeleton className="h-16 w-3/4 max-w-2xl bg-white/20" />
              <Skeleton className="h-16 w-1/2 max-w-xl bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ スケルトン */}
      <div className="container mx-auto px-6 py-16 flex-grow flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 space-y-12">
             <Skeleton className="h-32 w-full bg-black/5" />
             <Skeleton className="h-32 w-full bg-black/5" />
          </div>
          <div className="lg:col-span-1">
             <Skeleton className="h-64 w-full bg-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 実際のデータフェッチと描画を行うコンポーネント
async function UnitDetailFetcher({ slug }: { slug: string }) {
  // Fetch data from Supabase (DB first)
  const unit: Unit | null = await getUnitBySlug(slug);

  // Check Authentication/Authorization
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <UnitDetailClient
      slug={slug}
      initialUnit={unit}
      isAdmin={isAdmin}
    />
  );
}

export default async function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<UnitDetailSkeleton />}>
      <UnitDetailFetcher slug={slug} />
    </Suspense>
  );
}
