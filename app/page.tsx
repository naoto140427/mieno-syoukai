import Hero from "@/components/Hero";
import News from "@/components/News";
import { createClient } from "@/lib/supabase/server";
import { getNews } from "@/app/actions/news";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const news = await getNews(3);

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <News news={news} isAdmin={isAdmin} />
    </>
  );
}
