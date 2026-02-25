import { getUnitBySlug } from '@/app/actions/units';
import { createClient } from '@/lib/supabase/server';
import UnitDetailClient from '@/components/UnitDetailClient';

export default async function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch data from Supabase (DB first)
  const unit = await getUnitBySlug(slug);

  // Check Authentication/Authorization
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user; // Simple check as per instructions, adjust if role check needed

  return (
    <UnitDetailClient
      slug={slug}
      initialUnit={unit}
      isAdmin={isAdmin}
    />
  );
}
