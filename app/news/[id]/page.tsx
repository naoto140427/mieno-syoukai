import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import NewsDetailClient from "@/components/NewsDetailClient";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!news) {
    return {
      title: "News Not Found | MIENO CORP.",
      description: "News article not found.",
    };
  }

  return {
    title: `${news.title} | MIENO CORP.`,
    description: news.content ? news.content.substring(0, 160) : "MIENO CORP. News",
  };
}

export default async function NewsDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (!news) {
    notFound();
  }

  return <NewsDetailClient news={news} />;
}
