import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArchiveById } from '@/app/actions/archives';
import ArchiveDetailClient from '@/components/ArchiveDetailClient';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Operation Details - MIENO CORP.',
  description: 'Detailed operation records and tactical telemetry.',
};

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const archive = await getArchiveById(id);

  if (!archive) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return <ArchiveDetailClient archive={archive} isAdmin={isAdmin} />;
}
