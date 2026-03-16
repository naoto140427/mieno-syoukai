import { createClient } from "@/lib/supabase/server";
import { News as NewsType } from "@/types/database";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "ALL UPDATES & OPERATIONS | MIENO CORP.",
  description: "MIENO CORP. 最新通達および作戦行動記録",
};

export default async function NewsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  const news = (data as NewsType[]) || [];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        <div className="mb-16 border-b border-gray-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-sf-pro-display), sans-serif" }}>
                ALL UPDATES & OPERATIONS
            </h1>
            <p className="text-gray-500 text-lg">
                全通達および作戦行動一覧
            </p>
        </div>

        <div className="space-y-6">
        {news.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No updates available.</div>
        ) : (
            news.map((item) => (
                <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
                >
                <Link href={`/news/${item.id}`} className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                    {item.image_url && (
                        <div className="w-full md:w-56 h-40 md:h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                            <time className="font-mono text-sm text-gray-500">{item.date.replace(/-/g, '.')}</time>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                {item.category}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold leading-7 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </h3>
                    </div>
                    <div className="hidden md:flex items-center">
                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
                    </div>
                </Link>
                </div>
            ))
        )}
        </div>
      </div>
    </div>
  );
}
