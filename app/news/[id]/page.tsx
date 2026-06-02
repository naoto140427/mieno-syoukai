import { notFound } from 'next/navigation';
import { getNewsById } from '@/app/actions/news';
import NewsDetailClient from '@/components/NewsDetailClient';
import { Metadata } from 'next';
import { getUserSurveyByNewsId } from '@/app/actions/survey';
import DeploymentRSVP from '@/components/DeploymentRSVP';
import { createClient } from '@/lib/supabase/server';

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

    // Determine if user is logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch initial survey if logged in and it's a TOURING category
    let initialSurvey = null;
    if (user && news.category === 'TOURING') {
         initialSurvey = await getUserSurveyByNewsId(id);
    }

    return (
        <main className="min-h-screen bg-[#F5F5F7] pt-14">
            <NewsDetailClient news={news} hideLegacySurvey={!!user} />

            {/* Deployment RSVP Segment (logged-in agents) */}
            {news.category === 'TOURING' && user && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                     <DeploymentRSVP newsId={news.id} initialSurvey={initialSurvey} />
                </div>
            )}
        </main>
    );
}
