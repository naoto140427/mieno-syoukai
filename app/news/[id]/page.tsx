import { notFound } from 'next/navigation';
import { getNewsById } from '@/app/actions/news';
import NewsDetailClient from '@/components/NewsDetailClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) return { title: 'Not Found | MIENO CORP.' };

    const news = await getNewsById(id);
    if (!news) return { title: 'Not Found | MIENO CORP.' };

    return {
        title: `${news.title} | UPDATE | MIENO CORP.`,
        description: news.content.substring(0, 160)
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
        notFound();
    }

    const news = await getNewsById(id);

    if (!news) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black pt-24 pb-32">
            <NewsDetailClient news={news} />
        </main>
    );
}
