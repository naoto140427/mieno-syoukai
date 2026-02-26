import { getUnitBySlug } from '@/app/actions/units';
import { createClient } from '@/lib/supabase/server';
import UnitDetailClient from '@/components/UnitDetailClient';
import { Unit } from '@/types/database';

export default async function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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
