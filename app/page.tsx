import { Suspense } from "react";
import Hero from "@/components/Hero";
import News from "@/components/News";
import { createClient } from "@/lib/supabase/server";
import { getNews } from "@/app/actions/news";
import { Skeleton } from "@/components/ui/Skeleton";

async function NewsFetcher({ isAdmin }: { isAdmin: boolean }) {
  const news = await getNews(3);
  return <News news={news} isAdmin={isAdmin} />;
}

function NewsSkeleton() {
  return (
    <section className="bg-black py-24 border-t border-white/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div>
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 md:h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <Suspense fallback={<NewsSkeleton />}>
        <NewsFetcher isAdmin={isAdmin} />
      </Suspense>
    </>
  );
}
