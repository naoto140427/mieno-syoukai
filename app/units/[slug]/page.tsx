import { use } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUnitBySlug } from '@/app/actions/units';
import UnitDetailClient from '@/components/UnitDetailClient';

export default async function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch Unit Data
  const unit = await getUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  // Check Admin Status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <UnitDetailClient unit={unit} isAdmin={isAdmin} />
  );
}
