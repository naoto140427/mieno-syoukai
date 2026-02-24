import Hero from "@/components/Hero";
import News from "@/components/News";
import StrategicUnits from "@/components/StrategicUnits";
import { createClient } from "@/lib/supabase/server";
import { News as NewsType, Unit } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const [unitsRes, newsRes] = await Promise.all([
    supabase.from('units').select('*'),
    supabase.from('news').select('*').order('date', { ascending: false })
  ]);

  const units = (unitsRes.data as Unit[]) || [];
  const news = (newsRes.data as NewsType[]) || [];

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <StrategicUnits units={units} isAdmin={isAdmin} />
      <News news={news} isAdmin={isAdmin} />
    </>
  );
}
