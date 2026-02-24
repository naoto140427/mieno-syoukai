import Hero from "@/components/Hero";
import News from "@/components/News";
import { createClient } from "@/lib/supabase/server";
import { News as NewsType } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const { data } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  const news = (data as NewsType[]) || [];

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <News news={news} isAdmin={isAdmin} />
    </>
  );
}
