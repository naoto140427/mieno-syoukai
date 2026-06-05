import { Metadata } from 'next';
import UnitCompareClient from '@/components/UnitCompareClient';

export const metadata: Metadata = {
  title: '性能比較 | Strategic Units — MIENO CORP.',
  description: '三重野商会が保有する機動戦力のスペックを並べて比較。最大4台まで同時比較可能。',
};

export default function ComparePage() {
  return <UnitCompareClient />;
}
