import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArchiveById } from '@/app/actions/archives';
import ArchiveDetailClient from '@/components/ArchiveDetailClient';

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

  return <ArchiveDetailClient archive={archive} />;
}
